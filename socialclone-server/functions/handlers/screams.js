const {db}= require('../util/admin');

exports.GetScreams = (req,res) => {
    db.collection('screams')
        .orderBy('createdAt','desc')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(screams);
        })
        .catch(err => res.status(500).json(err));
};




exports.CreateScreams = (req,res) => {

    if(req.body.body.trim() === '') return res.status(400).json({comment:'Must not be empty'});

    const newScream = {
        userHandle: req.user.handle,
        body: req.body.body,
        createdAt: new Date().toISOString(),
        userImg: req.user.imageUrl,
        likeCount:0,
        commentCount:0
    };
    
    db.collection('screams')
        .add(newScream)
        .then(doc => {
            newScream.screamId = doc.id;
            res.json(newScream);
        })
        .catch(err => res.status(500).json({error:`the error is ${err}`}))
};

exports.getOneScream =  (req,res) => {
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc => {
            if(!doc.exists) return res.status(404).json({error:'scream not found'});
            
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db.collection('comments').where('screamId', '==', req.params.screamId).get();
        })
        .then(data => {
            screamData.comments = [];
            data.forEach(doc => {
                screamData.comments.push(doc.data());
            });
            return res.json(screamData);
        })
        .catch(err => res.status(500).json({error:err.code})); 
}

exports.addComment = (req,res) => {
    if(req.body.body.trim() === '') return res.status(400).json({message: 'body cant be empty'});
    let newComment = {
        createdAt: new Date().toISOString(),
        userHandle: req.user.handle,
        body: req.body.body,
        screamId: req.params.screamId,
        userImg: req.user.imageUrl
    };
    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc => {
            if(!doc.exists) return res.status(404).json({error:'scream not found'});
            return doc.ref.update({commentCount: doc.data().commentCount+1});
        })
        .then(() => db.collection('comments').add(newComment))
        .then(() => {
            res.json(newComment);
        })
        .catch(err => res.status(500).json({error:'something went wrong'}));
}

exports.likeScream = (req,res) => {
    const likeDocument = db.collection('likes').where('userHandle','==',req.user.handle)
        .where('screamId','==',req.params.screamId).limit(1);
    const screamDocument = db.doc(`/screams/${req.params.screamId}`);

    let screamData;

    screamDocument.get()
        .then(doc => {
            if(doc.exists){
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            }else {
                return res.status(404).json({error:'scream not found'});
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('likes').add({
                    screamId:req.params.screamId,
                    userHandle: req.user.handle
                })
                .then(() => {
                    screamData.likeCount++;
                    return screamDocument.update({likeCount: screamData.likeCount});
                })
                .then(() => {
                    return res.json(screamData);
                })
            } else{
                return res.status(400).json({error:'scream already liked'});
            }
        })
        .catch(err => res.status(500).json({error:err.code}));
}


exports.unlikeScream = (req,res) => {
    const likeDocument = db.collection('likes').where('userHandle','==',req.user.handle)
        .where('screamId','==',req.params.screamId).limit(1);
    const screamDocument = db.doc(`/screams/${req.params.screamId}`);

    let screamData;

    screamDocument.get()
        .then(doc => {
            if(doc.exists){
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            }else {
                return res.status(404).json({error:'scream not found'});
            }
        })
        .then(data => {
            if(data.empty){
                return res.status(400).json({error:'scream not liked'});
            } else{
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDocument.update({likeCount:screamData.likeCount});
                    })
                    .then(() => res.json(screamData));
            }
        })
        .catch(err => res.status(500).json({error:err.code}));
}


exports.deleteScream = (req,res) => {
    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc => {
            if(!doc.exists) return res.status(404).json({error:'scream not found'});
            if(doc.data().userHandle === req.user.handle) return db.doc(`/screams/${req.params.screamId}`).delete();
            else return res.status(403).json({error:'cant delete this post'});
        })
        .then(() => {
            return res.json({message:'scream deleted successfully'});
        })
        .catch(err => res.status(500).json({error:'something went wrong'}))
}