import admin from 'firebase-admin';
const firebaseInit = () => {
    if (!process.env.FIREBASE_ACCOUNT_KEY) {
        throw new Error('FIREBASE_ACCOUNT_KEY is missing in environment variables');
    }
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase initialized successfully');
        return admin; // Return the admin instance
    }
    catch (err) {
        console.error('Firebase initialization error:', err);
        throw err;
    }
};
export default firebaseInit;
//# sourceMappingURL=firebase.js.map