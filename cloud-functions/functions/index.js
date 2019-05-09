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

exports.removeUser = functions.https.onCall((data, context) => {
    const {uid} = data 
    return admin.auth().deleteUser(uid)
    .then(() => {
        //TODO: remove all user stuff
        return {completed: true}
    })
    .catch(() => ({completed: false}))
});