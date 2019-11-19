const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const axios = require('axios');
// fake SMTP service = Ethereal

admin.initializeApp(functions.config().firebase);

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

exports.checkAmountAlert = functions.https.onRequest(async (request, response) => {

    let arrayOfAlerts = await getArrayOfAmountAlert();

    arrayOfAlerts.forEach(async (alert) => {
        console.log('Alert: ' + JSON.stringify(alert));

        if (checkIfAlertExpire(alert) === true) {
            await sendEmailAlert(alert);
            // delete alert from database
        }

        // testing rate
        let currentRate = await getCurrentRate(alert.currencyCode);
        console.log('currentRate');
        console.log(currentRate);

    });

    return response.send("Amount alert evaluation end");
});

async function getArrayOfAmountAlert() {

    let db = admin.firestore();

    return db.collection('amountAlert')
        .get()
        .then((snapshot) => {
            let arrayOfAlerts = [];
            snapshot.forEach(doc => {
                let amountAlert = doc.data();
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
    console.log(alert.expireDate);
    // date is unix timestamp
    let expireDate = new Date(alert.expireDate._seconds * 1000);
    let today = new Date();
    // set hours and minutes to 0 for comparing
    expireDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return (expireDate.valueOf() === today.valueOf());
}

async function sendEmailAlert(amountAlert) {

    let userData = await getUserData(amountAlert.userId);
    let rate = await getCurrentRate(amountAlert.currencyCode);

    let message = {
        from: `Sender Name <sender@example.com>`,
        to: `Recipient <${userData}>`,
        subject: `Alert walutowy`,
        text: `Kurs waluty ${amountAlert.currencyCode} wynosi ${rate}.`,
        html: ``
    };

    await sendEmail(message);
}

async function getUserData(userId) {
    return `${userId}@example.com`;
}

async function getCurrentRate(currencyCode) {
    try {
        const urlA = `http://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/`;
        const response = await axios.default.get(urlA);
        const data = response.data;
        return data;
    } catch (error) {
        try {
            const urlB = `http://api.nbp.pl/api/exchangerates/rates/b/${currencyCode}/`;
            const response = await axios.default.get(urlB);
            const data = response.data;
            return data;
        } catch (error) {
            return Number.MAX_VALUE;
        }
    }
}