const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {db} = require('./util/admin');
const {GetScreams, CreateScreams, getOneScream, addComment, deleteScream, likeScream, unlikeScream} = require('./handlers/screams');
const {signUp, Login, uploadImage, addUserDetails, UserData, getUserDetails, markNotificationsRead} = require('./handlers/users');
const FBAuth = require('./util/fbAuth');

app = express();

app.use(express.static(__dirname));
app.use(cors());

//*Scream Routes
app.get('/getScreams',GetScreams);
app.post('/createScream', FBAuth,CreateScreams);
app.get('/scream/:screamId', getOneScream);
app.post('/scream/:screamId/comment',FBAuth, addComment);
app.get('/scream/:screamId/like',FBAuth,likeScream)
app.get('/scream/:screamId/unlike',FBAuth,unlikeScream)
app.delete('/scream/:screamId',FBAuth ,deleteScream);

//* User Routes
app.post('/signup', signUp);
app.post('/login', Login);
app.post('/user/image',FBAuth, uploadImage);
app.post('/user',FBAuth, addUserDetails);
app.get('/user',FBAuth, UserData);
app.get('/user/:handle',getUserDetails);
app.post('/notifications',FBAuth,markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);


exports.createNotificationOnLike = functions.region('europe-west1')
    .firestore.document('likes/{id}')
    .onCreate(snapshot => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type:'like',
                        read:false,
                        screamId: doc.id
                    })
                }
            })
    });

exports.deleteNotifOnUnlike = functions.region('europe-west1')
        .firestore.document('likes/{id}')
        .onDelete(snapshot => {
            return db.doc(`/notifications/${snapshot.id}`).delete()
        })

exports.createNotificationOnComment = functions.region('europe-west1')
    .firestore.document('comments/{id}')
    .onCreate(snapshot => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if(doc.data().userHandle === snapshot.data().userHandle) return;
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type:'comment',
                    read:false,
                    screamId: doc.id
                })
            })
        });


exports.onUserImageChange = functions.region('europe-west1')
            .firestore.document('/users/{id}')
            .onUpdate(change => {
                if(change.before.data().imageUrl !== change.after.data().imageUrl){
                    let batch = db.batch();
                    return db.collection('screams').where('userHandle','==',change.after.data().userHandle).get()
                        .then(data => {
                            data.forEach(doc => {
                                const scream = db.doc(`/screams/${doc.id}`);
                                batch.update(scream, {userImg: change.after.data().imageUrl});
                            });
                            return batch.commit();
                        })
                } else return true;
            });


exports.onscreamDeletion = functions.region('europe-west1')
            .firestore.document('/screams/{screamId}')
            .onDelete((snapshot,context) => {
                const screamId = context.params.screamId;
                const batch = db.batch();
                return db.collection('comments').where('screamId','==',screamId).get()
                        .then(data => {
                            if(!data.empty){
                                data.forEach(doc => {
                                    batch.delete(db.doc(`/comments/${doc.id}`));
                                })
                            }
                            return db.collection('likes').where('screamId','==',screamId).get();
                        })
                        .then(data => {
                            if(!data.empty){
                                data.forEach(doc => {
                                    batch.delete(db.doc(`/likes/${doc.id}`));
                                })
                            }
                            return db.collection('notifications').where('screamId','==',screamId).get();
                        })
                        .then(data => {
                            if(!data.empty){
                                data.forEach(doc => {
                                    batch.delete(db.doc(`/notifications/${doc.id}`));
                                })
                            }   
                            return batch.commit();
                        })
                        .catch(err => res.json({error:err}));
            })