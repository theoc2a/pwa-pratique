
const webPush = require('web-push');
const pushServerKeys = require('./pushServerKeys.json');
const pushClientSubscription = require('./pushClientSubscription.json');

// Test de récupération des données
console.log(pushServerKeys, pushClientSubscription);


webPush.setVapidDetails('mailto:theo.cussac2a@gmail.com', pushServerKeys.publicKey, pushServerKeys.privateKey);

// Pour sendNotification API reference sendNotification(pushSubscription, payload, options)
// voir https://github.com/web-push-libs/web-push#sendnotificationpushsubscription-payload-options
webPush.sendNotification(pushClientSubscription, 'Notification envoyée depuis le serveur push node :)')
    .then(
        function (result) {
            console.log("sendNotification SUCCESS", result);
        },
        function (err) {
            console.log("sendNotification ERROR", err);
        }
    )
    .catch(
        function (err) {
            console.log("sendNotification ERROR catch", err);
        }
    )