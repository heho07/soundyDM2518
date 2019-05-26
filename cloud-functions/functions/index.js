const functions = require('firebase-functions');
// The Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const storageBucket = admin.storage().bucket()

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
            var listOfSoundsUris = []
            querySnapshot.forEach(doc => {
                listOfSoundsUris.push(doc.data().storageUri)
                doc.ref.delete()
            })
            listOfSoundsUris.forEach(uri => {
                storageBucket.file(uri).delete()
            })
            return {completed: true}
        })
    })
    .catch(() => ({completed: false}))
});

exports.removeOnePost = functions.https.onCall((data, context) => {
    const {id, storageUri} = data 
   
    let doc = db.collection("all-sounds").doc(id)
    return doc.delete().then(value => {
        return storageBucket.file(storageUri).delete().then(value => {
            return {completed: true}
        })
    })
});