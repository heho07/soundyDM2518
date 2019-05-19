const functions = require('firebase-functions');
// The Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

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
        let postsFromUser = db.collection("all-sounds").where("user", "==", uid)
        return postsFromUser.get()
        .then(querySnapshot => {
            var listOfSounds = []
            querySnapshot.forEach(doc => {
                listOfSounds.push(doc.data().url)
                doc.ref.delete()
            })
            listOfSounds.forEach(url => {
                //TODO: Delete actual sound from storage
            })
            return {completed: true, sounds: listOfSounds}
        })
    })
    .catch(() => ({completed: false}))
});