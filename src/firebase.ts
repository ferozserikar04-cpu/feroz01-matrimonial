import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Capacitor } from '@capacitor/core';
import config from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
let auth;
if (Capacitor.isNativePlatform()) {
  auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence]
  });
} else {
  auth = getAuth(app);
}

// Initialize Firestore with specific databaseId
const db = getFirestore(app, config.firestoreDatabaseId || undefined);

// Initialize Storage
const storage = getStorage(app);

// Initialize App Check optionally if a reCAPTCHA site key is provided
let appCheck;
if (typeof window !== 'undefined' && config.recaptchaSiteKey) {
  try {
    const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(config.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    });
    console.log('Firebase App Check initialized successfully.');
  } catch (err) {
    console.warn('Failed to initialize Firebase App Check:', err);
  }
}

export { app, auth, db, storage, appCheck };
