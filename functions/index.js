const functions = require('firebase-functions');
const gcm = require('node-gcm');
const admin = require('firebase-admin');
var sender = new gcm.Sender('AAAAJKl2dZI:APA91bHt4verbS5muSnSUbNHR3qrAYY8XxiK6yxj9GwBmKL-6nD5SWJfetFPnCsEEI1CXvVdhoXHEqHhhPSKEU9aGxQa9GhS1d9__Wde2pK4b4MxVnCMxtSBsXDpR6UeB7RHuoAhHLy1');
var message = new gcm.Message();

var message = new gcm.Message({
  "priority" : "high",
  "notification" : {
    "body" : "Your vital sign seems to be elevated",
    "title" : "Heart rate - Alert",
    "icon" : "app_icon.png",
    "sound" : "policehorn.mp3",
    "click_action" : "alaramactivity"
  },
  "data" : {
    "volume" : "3.21.15",
  }
});

var config = {
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://securitybuzzer.firebaseio.com",
};

admin.initializeApp(config);
var db = admin.database();
var ref = db.ref('ids');

exports.helloWorld = functions.https.onRequest((request, response) => {
    
    var regTokens = [];

    ref.once('value', (snapshot) => {
        snapshot.forEach((data) => {
            regTokens.push(data.val().token);
        })
    }).then( () =>{

    console.log(regTokens);
    
    sender.send(message, {registrationTokens: regTokens}, function(err, data){
        if(err)
            response.send(err);
        else
            response.send(data);
    })
})
});



