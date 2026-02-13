import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { requestNotificationPermission, onMessageListener } from '../firebase';
import { API_BASE_URL } from '../config/api';

const FCMHandler = () => {
    const location = useLocation();
    const isSynced = useRef(false);

    useEffect(() => {
        console.log('FCM: 🔍 Checking setup on path:', location.pathname);
        if (!('Notification' in window)) {
            console.error('FCM: ❌ Notifications not supported in this browser');
            return;
        }
        if (!('serviceWorker' in navigator)) {
            console.error('FCM: ❌ Service Workers not supported');
            return;
        }

        const setupFCM = async () => {
            console.log('FCM: 🚀 Initializing setup...');

            let registration;
            try {
                registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                console.log('FCM: 📡 Waiting for Service Worker to be ready...');
                await navigator.serviceWorker.ready;
                console.log('FCM: ✅ Service Worker Registered & Ready');
            } catch (err) {
                console.error('FCM: ❌ Service Worker Registration failed:', err);
                return;
            }

            const userData = JSON.parse(localStorage.getItem('userData'));
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const memberToken = localStorage.getItem('userToken');

            const sessionToken = adminInfo?.token || memberToken || userData?.token;

            if (!sessionToken) {
                console.log('FCM: ⏸️ No active session, skipping sync');
                return;
            }

            if (isSynced.current) {
                console.log('FCM: ⏩ Already synced in this session');
                return;
            }

            try {
                console.log('FCM: 🔑 Requesting FCM Token from Firebase...');
                const fcmToken = await requestNotificationPermission(registration);

                if (fcmToken) {
                    const isMobileUser = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const platform = adminInfo ? 'web' : (isMobileUser ? 'app' : 'web');

                    console.log(`FCM: 📤 Syncing ${adminInfo ? 'Admin' : 'Member'} Token to Backend (${platform})...`);

                    const endpoint = adminInfo ? '/api/admin/auth/fcm-token' : '/api/user/auth/fcm-token';
                    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionToken}`
                        },
                        body: JSON.stringify({ token: fcmToken, platform })
                    });

                    const data = await response.json();
                    if (data.success) {
                        console.log('FCM: ✨ Token successfully synced with backend!');
                        isSynced.current = true;
                    } else {
                        console.error('FCM: ❌ Backend sync failed:', data.message);
                    }
                } else {
                    console.warn('FCM: ⚠️ No token returned from requestNotificationPermission');
                }
            } catch (err) {
                console.error('FCM: ❌ Critical Error during setup:', err);
            }
        };

        const timeoutId = setTimeout(setupFCM, 3000);

        // Define a test function on the window for users to test popups
        window.triggerTestNotification = async () => {
            console.log('FCM: 🧪 Attempting manual test popup...');
            const registration = await navigator.serviceWorker.ready;
            if (registration) {
                if (Notification.permission !== 'granted') {
                    console.log('FCM: Permission is', Notification.permission, '. Requesting...');
                    await Notification.requestPermission();
                }

                registration.showNotification('Test Pop-up ✅', {
                    body: 'If you see this, native popups are WORKING!',
                    icon: 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png',
                    tag: 'manual-test',
                    requireInteraction: true
                });
                alert('Test command sent to browser. Check your screen corner!');
            } else {
                console.error('FCM: Service worker not ready for test');
            }
        };

        // Foreground listener
        const unsubscribe = onMessageListener(async (payload) => {
            console.log('FCM: 📥 Message Received in Foreground:', payload);

            const permission = Notification.permission;
            const title = payload.notification?.title || 'V10 Notification';
            const body = payload.notification?.body || 'New message received';

            if (permission === 'granted') {
                const registration = await navigator.serviceWorker.ready;
                if (registration) {
                    console.log('FCM: 🔔 Showing native popup...');
                    registration.showNotification(title, {
                        body: body,
                        icon: 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png',
                        tag: payload.messageId || Date.now().toString(),
                        requireInteraction: true,
                        renotify: true,
                        vibrate: [200, 100, 200]
                    });
                }
            } else {
                console.warn('FCM: 🔇 Popup blocked. Status:', permission);
            }
        });

        return () => {
            clearTimeout(timeoutId);
            if (unsubscribe) unsubscribe();
        };
    }, []); // Run on mount only to prevent duplicate listeners on navigation

    return null;
};

export default FCMHandler;
