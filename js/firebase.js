import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getAuth } from 
"https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const firebaseConfig = {

apiKey: "ដាក់_API_KEY_របស់អ្នក",

authDomain: "ដាក់_AUTH_DOMAIN",

projectId: "ដាក់_PROJECT_ID",

storageBucket: "ដាក់_STORAGE_BUCKET",

messagingSenderId: "ដាក់_SENDER_ID",

appId: "ដាក់_APP_ID"

};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);
