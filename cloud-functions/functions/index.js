const functions = require('firebase-functions');
// The Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();

exports.getAllUsers = functions.https.onCall((data, context) => {
    return admin.auth().listUsers().then(userRecords => {
        return {users: userRecords.users}
    }).catch(err => {
        return {users: null}
    })
});