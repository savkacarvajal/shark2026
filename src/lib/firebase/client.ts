import { initializeApp, getApps, getApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Fallback placeholder values let the SDK initialize (no network calls happen yet) when
// Firebase hasn't been configured (.env not set up) — needed so ?preview= mode (see guards.ts)
// can render pages without a real project. Real env vars always take priority.
const firebaseConfig = {
	apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || "demo-api-key",
	authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
	projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
	storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
	messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
	appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let emulatorsConnected = false;

if (import.meta.env.PUBLIC_USE_FIREBASE_EMULATORS === "true" && !emulatorsConnected) {
	connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
	connectFirestoreEmulator(db, "127.0.0.1", 8080);
	emulatorsConnected = true;
}
