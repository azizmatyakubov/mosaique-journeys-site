/* Firebase initialisation (compat SDK, loaded before script.js / admin.js).
   These web config values are public client identifiers — safe to ship in
   client code. Security is enforced by Firestore rules, not by hiding these. */
(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyBtcqek5ffRnO1D8dc8W0DpSPlTPs9kVY0",
    authDomain: "mosaique-journeys.firebaseapp.com",
    projectId: "mosaique-journeys",
    storageBucket: "mosaique-journeys.firebasestorage.app",
    messagingSenderId: "636280354221",
    appId: "1:636280354221:web:1166380697717339775d24"
  };
  if (window.firebase && firebase.apps && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
})();
