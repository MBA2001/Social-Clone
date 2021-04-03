const {db, admin} = require('../util/admin');
const {validateSignup, validateLogin, reduceUserDetails} = require('../util/validations');
const config = require('../util/config');


const firebase = require('firebase');
firebase.initializeApp(config);


//Sign up
exports.signUp =  (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPass: req.body.confirmPass,
        userHandle: req.body.handle,
    };
    
    //* Data Validation
    const {errors,valid} = validateSignup(newUser);
    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userId;
    db.doc(`/users/${newUser.userHandle}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({handle:'this handle is already taken'});
            }else{
                return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
            }
        })
        .then(data => {
            
            userId = data.user.uid;
            return data.user.getIdToken(); 
        })
        .then(tokenId => {
            token = tokenId;
            const userCredentials = {
                userHandle : newUser.userHandle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`
            };
            return db.doc(`/users/${newUser.userHandle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch(error => {
            if(error.code === "auth/email-already-in-use"){
                return res.status(400).json({error});
            }else{
                return res.status(500).json({general: 'something went wrong please try again'});
            }
        });
}

exports.Login = (req,res) => {
    const User = {
        email: req.body.email,
        password: req.body.password
    };

    const {errors, valid} = validateLogin(User);
    if(!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(User.email,User.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        })
        .catch(err => {
            return res.status(403).json({general:'Wrong Email or Password'})
        })

};

exports.getUserDetails = (req,res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if(doc.exists){
                userData.user = doc.data();
                return db.collection('screams').where('userHandle','==',req.params.handle)
                    .orderBy('createdAt','desc')
                    .get();
            }else{
                return res.status(403).json({error:'user doesnt exist'})
            }
        })
        .then(data => {
            userData.screams = [];
            data.forEach(doc => {
                userData.screams.push({
                    ...doc.data(),
                    screamId: doc.id
                })
            })
            return res.json(userData);
        })
        .catch(error => res.status(500).json(error))
}


exports.addUserDetails = (req,res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => res.status(200).json({message:'details added successfully'}))
        .catch(err => res.status(500).json({error:err.code}))
}

exports.UserData = (req,res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle', '==', req.user.handle).get();
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('/notifications').where('recipient','==',req.user.handle)
                    .orderBy('createdAt','desc').limit(10).get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    ...doc.data(),
                    notificationId: doc.id
                });
            })
            return res.json(userData);
        })
        .catch(err => res.status(500).json({error:err.code}));
}



exports.uploadImage = (req,res) => {
     const BusBoy = require('busboy');
     const path = require('path');
     const os = require('os');
     const fs = require('fs');

     const busBoy = new BusBoy({headers:req.headers});

     let imageFileName;
     let imageToBeUploaded = {};
     busBoy.on('file',(fieldName,file,fileName,encoding,mimetype) => {
        if(mimetype !== 'image/png' && mimetype !== 'image/jpeg') return res.status(400).json({error:'file should be an image'});
        const imageExten = fileName.split('.')[fileName.split('.').length -1];
        imageFileName = `${Math.round(Math.random()*1000000000)}.${imageExten}`;
        const filePath = path.join(os.tmpdir(),imageFileName);
        imageToBeUploaded = {filePath,mimetype};
        file.pipe(fs.createWriteStream(filePath));
     });
     busBoy.on('finish',()=> {
        admin.storage().bucket().upload(imageToBeUploaded.filePath,{
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({imageUrl});
        })
        .then(()=> {
            return res.json({message: `image uploaded successfully`})
        })
        .catch(err => res.status(500).json({error: err.code}))
     })
     busBoy.end(req.rawBody);
}


exports.markNotificationsRead = (req,res) => {
    let batch = db.batch();
    req.body.forEach(notifId => {
        const notification = db.doc(`/notifications/${notifId}`);
        batch.update(notification, {read:true});
    })
    batch.commit()
        .then(() => {
            return res.json({message:'notification read'});
        })
        .catch(error => res.statu(500).json(error));
}