importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBgSWiJsKzgDPhD1iKsRhToO8s2Evg-V9Y",
    authDomain: "v10-fitness-lab.firebaseapp.com",
    projectId: "v10-fitness-lab",
    storageBucket: "v10-fitness-lab.firebasestorage.app",
    messagingSenderId: "813283979538",
    appId: "1:813283979538:web:065df5034185323cb0c3cb",
    measurementId: "G-6SZYYT44M0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
