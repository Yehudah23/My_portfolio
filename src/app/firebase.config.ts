// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyA9STuBtfQMTL0dD4x02-fa8pC7znnbusc",
  authDomain: "royalsandnobles-546e7.firebaseapp.com",
  projectId: "royalsandnobles-546e7",
  storageBucket: "royalsandnobles-546e7.firebasestorage.app",
  messagingSenderId: "754069665291",
  appId: "1:754069665291:web:7099f4f4e12adf9b91790e",
  measurementId: "G-FNFSBSJKKJ"
} as const;

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(value =>
  value.includes('YOUR_')
);
