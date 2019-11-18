const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.testMessage = functions.https.onRequest((request, response) => {
    response.send("Test message http");
    console.log('Test message console');
});

exports.sendEmailHttp = functions.https.onRequest((request, response) => {
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
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

        // Message object
        let message = {
            from: 'Sender Name <sender@example.com>',
            to: 'Recipient <recipient@example.com>',
            subject: 'Nodemailer is unicode friendly ✔',
            text: 'Hello to myself!',
            html: '<p><b>Hello</b> to myself!</p>'
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
    response.send("Email send");
});

exports.readDatabse = functions.https.onRequest((request, response) => {
    console.log('Database console');

    let db = admin.firestore();
    console.log(JSON.stringify(db));

    db.collection('amountAlert')
        .get()
        .then(
            snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc);
                })
            }
        )
        .catch(error => {
            console.log(error);
        });

    response.send("Database response");

});