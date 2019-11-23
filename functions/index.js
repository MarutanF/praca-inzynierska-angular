const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const axios = require('axios');
const serviceAccount = require("./serviceAccountKey.json");
// fake SMTP service = Ethereal

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://praca-inzynierska-firebase.firebaseio.com"
});

// EXAMPLE FUNCTION
exports.testMessageHttp = functions.https.onRequest((request, response) => {
    response.send("Test message http");
    console.log('Test message console');
});

exports.sendEmailHttp = functions.https.onRequest(async (request, response) => {
    let message = {
        from: 'Sender Name <sender@example.com>',
        to: 'Recipient <recipient@example.com>',
        subject: 'Nodemailer subject',
        text: 'Hello to myself!',
        html: '<p><b>Hello</b> to myself!</p>'
    };
    await sendEmail(message);
    return response.send("Email send");
});

exports.readDatabseHttp = functions.https.onRequest(async (request, response) => {
    console.log('Database console');

    let db = admin.firestore();

    db.collection('amountAlert')
        .get()
        .then(
            snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc.data());
                })
            }
        )
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            return response.send("Database response");
        }
        );
});

exports.downloadDataHttp = functions.https.onRequest(async (request, response) => {
    const url = "https://jsonplaceholder.typicode.com/posts/1";
    try {
        const response = await axios.default.get(url);
        const data = response.data;
        console.log(JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
    return response.send("Data downloaded");
});

// END EXAMPLE FUNCTION

async function sendEmail(message) {
    try {
        let info = await transporter.sendMail(message);
        // console.log('Message sent: %s', info.messageId);
        console.log('Email sent - Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    catch (error) {
        console.log('Error ' + error);
        return process.exit(1);
    }
};

// for sendEmail
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'pierre.parisian@ethereal.email',
        pass: 'FRKhyEX4qkKPntRpuZ'
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.checkAmountAlertHttp = functions.https.onRequest(async (request, response) => {
    await checkAmountAlert();
    return response.send("Amount alert evaluation end");
});

exports.checkAmountAlertScheduled = functions.pubsub.schedule('every 1 day').onRun((context) => {
    checkAmountAlert();
    return null;
});

async function checkAmountAlert() {
    let arrayOfAlerts = await getArrayOfAmountAlert();

    arrayOfAlerts.forEach(async (alert) => {
        console.log('Alert: ' + JSON.stringify(alert));
        let currentRate = await getCurrentRate(alert.currencyCode);
        if (checkIfAlertExpire(alert) || currentRate <= alert.amount) {
            await sendEmailAlert(alert, currentRate);
            await deleteAmountAlert(alert.docId);
        }
    });
}

async function deleteAmountAlert(docId) {

    let db = admin.firestore();

    return db.collection('amountAlert')
        .doc(docId)
        .delete();
}

async function getArrayOfAmountAlert() {

    let db = admin.firestore();

    return db.collection('amountAlert')
        .get()
        .then((snapshot) => {
            let arrayOfAlerts = [];
            snapshot.forEach(doc => {
                let amountAlert = doc.data();
                amountAlert.docId = doc._ref._path.segments[1];
                arrayOfAlerts.push(amountAlert);
            });
            return arrayOfAlerts;
        })
        .catch(error => {
            console.log('Error ' + error);
            return process.exit(1);
        });
}

function checkIfAlertExpire(alert) {
    // check if expire date is equal today
    // date is unix timestamp
    let expireDate = new Date(alert.expireDate._seconds * 1000);
    let today = new Date();
    // set hours and minutes to 0 for comparing
    expireDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return (expireDate.valueOf() <= today.valueOf());
}

async function sendEmailAlert(alert, currentRate) {

    let userEmail = await getUserEmail(alert.userId);

    let message = {
        from: `Sender Name <sender@example.com>`,
        to: `Recipient <${userEmail}>`,
        subject: `Alert walutowy`,
        text: `Kurs waluty ${alert.currencyCode} wynosi ${currentRate}.`,
        html: ``
    };

    await sendEmail(message);
}

async function getUserEmail(userId) {
    return admin.auth().getUser(userId)
        .then(function (userRecord) {
            return userRecord.providerData[0].email;
        })
        .catch(function (error) {
            console.log('Error ' + error);
            return process.exit(1);
        });
}

async function getCurrentRate(currencyCode) {
    try {
        const urlA = `http://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/`;
        const response = await axios.default.get(urlA);
        const data = response.data.rates[0].mid;
        return data;
    } catch (error) {
        try {
            const urlB = `http://api.nbp.pl/api/exchangerates/rates/b/${currencyCode}/`;
            const response = await axios.default.get(urlB);
            const data = response.data.rates[0].mid;
            return data;
        } catch (error) {
            return Number.MAX_VALUE;
        }
    }
}

