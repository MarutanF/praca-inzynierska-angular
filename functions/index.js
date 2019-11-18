const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const axios = require('axios');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.testMessage = functions.https.onRequest((request, response) => {
    response.send("Test message http");
    console.log('Test message console');
});

let testAccount = null;
async function createTestAccount() {
    if (testAccount === null) {
        testAccount = await nodemailer.createTestAccount();
        return testAccount;
    }
    return testAccount;
}

function getTransporter(account) {
    const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    return transporter;
}

let message = {
    from: 'Sender Name <sender@example.com>',
    to: 'Recipient <recipient@example.com>',
    subject: 'Nodemailer subject',
    text: 'Hello to myself!',
    html: '<p><b>Hello</b> to myself!</p>'
};

async function sendEmail(message) {
    try {
        let testAccount = await createTestAccount();
        console.log('Credentials obtained, sending message...');
        let transporter = getTransporter(testAccount);
        let info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    catch (error) {
        console.log('Error ' + error);
        return process.exit(1);
    }
};

exports.sendEmailHttp = functions.https.onRequest(async (request, response) => {
    await sendEmail(message);
    return response.send("Email send");
});

exports.readDatabse = functions.https.onRequest(async (request, response) => {
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

exports.downloadData = functions.https.onRequest(async (request, response) => {
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