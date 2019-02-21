const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore')
const admin = require('firebase-admin');
const cron = require("node-cron");
admin.initializeApp();
const validator = require('validator');
exports.discount = functions.https.onRequest((req, res) => {

    const firestore = new Firestore();
    const settings = {
        timestampsInSnapshots: true
    };
    firestore.settings(settings);

  var  docRef = firestore.collection('users');

    switch (req.method) {

        case 'GET':
            readData()
            break;

        case 'POST':
           writeTODB(res,docRef,req.body.name,req.body.age,req.body.gender,req.body.club)
            break;

        case 'PUT':
            
            res.status(200).send(`cron job started: seconds `);
            cron.schedule("* * * * * *", function() {
                console.log("running a task every minute");
              });
            break;

        default:
            res.status(500).send({
                error: 'Something blew up!'
            });
            break;


    }



});

function readData() {

    var getDoc = docRef.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());

                res.status(200).json(doc.data())

            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
            res.status(500).send(`Error getting document: ${err}`);

        });
}

function validation() {

    console.log('inside method')
    if (req.method === 'PUT') {
        res.status(403).send('Forbidden!');
    }
    let amount = req.query.orderAmt;
    if (!amount) {
        amount = req.body.orderAmt;
    }
    let discount;
    if (!validator.isNumeric(amount)) {
        discount = 'Invalid Order Amount';
    } else {
        if (amount < 200) {
            discount = 'Eligible for extra 10% off';
        } else if (amount > 199 && amount < 400) {
            discount = 'Eligible for extra 15% off';
        } else if (amount > 399 && amount < 600) {
            discount = 'Eligible for extra 20% off';
        } else {
            discount = 'Eligible for extra 25% off';
        }

        res.status(200).send(discount);
    }



}


function writeTODB(res,docRef,_name,_age,_gender,_club) {
    var data = {
        name: _name,
        age: _age,
        gender: _gender,
        club:_club
    };

    var setAda = docRef.add(data).then(ref => {
        console.log('Added document with ID: ', ref.id);
        res.status(200).send(`Added document with ID: , ${ref.id}`);
    }).catch(err=>{
        console.log(err);
        res.status(200).send(`Error: , ${err}`);
    });
}