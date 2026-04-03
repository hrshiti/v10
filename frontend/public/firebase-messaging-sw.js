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
        data: payload.data // CRITICAL: Pass data for click handler
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Default URL if click_action is missing
    let url = '/';
    if (event.notification.data && event.notification.data.click_action) {
        url = event.notification.data.click_action;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // If window already open, focus it and navigate to the URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(new URL('/', self.location.origin).href) && 'focus' in client) {
                    return client.navigate(url).then(c => c.focus());
                }
            }
            // If window not open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
