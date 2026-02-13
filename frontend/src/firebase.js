import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBgSWiJsKzgDPhD1iKsRhToO8s2Evg-V9Y",
    authDomain: "v10-fitness-lab.firebaseapp.com",
    projectId: "v10-fitness-lab",
    storageBucket: "v10-fitness-lab.firebasestorage.app",
    messagingSenderId: "813283979538",
    appId: "1:813283979538:web:065df5034185323cb0c3cb",
    measurementId: "G-6SZYYT44M0"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async (registration) => {
    try {
        console.log('FCM: Requesting permission...');
        const permission = await Notification.requestPermission();
        console.log('FCM: Permission status:', permission);

        if (permission === 'granted') {
            console.log('FCM: Permission granted. Fetching token with VAPID key...');

            const token = await getToken(messaging, {
                vapidKey: "BPJiBHUCnFFidWCfzodnQSV8rW9_G8fnw4CfAxgiIjOKx6vF_akeJ-A3U-PD8rPylMm4owfXzZvWUeeqAQvE1lI",
                serviceWorkerRegistration: registration
            });

            if (token) {
                console.log('FCM: Token acquired:', token.substring(0, 15) + '...');
                return token;
            } else {
                console.warn('FCM: No registration token available.');
            }
        } else {
            console.warn('FCM: Permission not granted. Notifications will not work.');
        }
    } catch (err) {
        console.error('FCM: ❌ Error in requestNotificationPermission:', err);
    }
    return null;
};

/**
 * Listens for messages when the app is in the foreground.
 * @param {Function} callback - Function to handle the payload
 */
export const onMessageListener = (callback) => {
    return onMessage(messaging, (payload) => {
        callback(payload);
    });
};

export default app;
