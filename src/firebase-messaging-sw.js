importScripts(
  "https://www.gstatic.com/firebasejs/9.9.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  projectId: "indus-real-time",
  appId: "1:230132059179:web:f2d18333b4179e19662e6e",
  databaseURL: "https://indus-real-time-default-rtdb.firebaseio.com",
  storageBucket: "indus-real-time.appspot.com",
  apiKey: "AIzaSyCSN-OkKzwdGo6FLCDo_9rnGJ6T2E-sXIU",
  authDomain: "indus-real-time.firebaseapp.com",
  messagingSenderId: "230132059179",
  measurementId: "G-L299VNY022",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
