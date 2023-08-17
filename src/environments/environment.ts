// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  firebase: {
    projectId: "indus-real-time",
    appId: "1:230132059179:web:f2d18333b4179e19662e6e",
    databaseURL: "https://indus-real-time-default-rtdb.firebaseio.com",
    storageBucket: "indus-real-time.appspot.com",
    apiKey: "AIzaSyCSN-OkKzwdGo6FLCDo_9rnGJ6T2E-sXIU",
    authDomain: "indus-real-time.firebaseapp.com",
    messagingSenderId: "230132059179",
    measurementId: "G-L299VNY022",
    vapidKey:
      "BJ78ycJ5KVnPYeeifd9jZ95Q13ntJcyGwU5-7852g1mfknhe86VxCE_cDrRTMne7spUXmD0IL6hX4FnCJMQ_F0w",
  },
  production: false,
  GAPI_CLIENT_ID:
    "610238836644-t2jmeqc4k1bp2ailhin7rs8f520m37mh.apps.googleusercontent.com",
  OPEN_AI_API_KEY: "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",
};
