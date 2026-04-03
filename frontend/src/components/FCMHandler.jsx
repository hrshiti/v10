import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { requestNotificationPermission, onMessageListener } from '../firebase';
import { API_BASE_URL } from '../config/api';

const FCMHandler = () => {
    const location = useLocation();
    const isSynced = useRef(false);

    useEffect(() => {
        console.log('FCM: 🔍 Checking setup on path:', location.pathname);

        // --- DEFENSIVE CHECKS ---
        // 1. Basic support checks
        if (!('Notification' in window)) {
            console.warn('FCM: ⚠️ Notifications not supported in this browser');
            return;
        }

        if (!('serviceWorker' in navigator)) {
            console.warn('FCM: ⚠️ Service Workers not supported');
            return;
        }

        // 2. iOS specific check for in-app browsers (Google App, etc)
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isInstagram = /Instagram/i.test(navigator.userAgent);
        const isFacebook = /FBAN|FBAV/i.test(navigator.userAgent);
        const isGoogleApp = /GSA\//i.test(navigator.userAgent); // This matches Google Search App on iOS

        // Often in-app browsers block notifications/SW or crash on initialization
        if (isIOS && (isInstagram || isFacebook || isGoogleApp)) {
            console.log('FCM: ⏸️ Running in iOS In-App Browser, skipping FCM setup to prevent issues');
            return;
        }

        const setupFCM = async () => {
            console.log('FCM: 🚀 Initializing setup...');

            let registration;
            try {
                // Ensure service worker is registered with proper error handling
                registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(err => {
                    console.warn('FCM: ⚠️ Service Worker Registration failed (silent):', err);
                    return null;
                });

                if (!registration) return;

                console.log('FCM: 📡 Waiting for Service Worker to be ready...');
                // Set a timeout for waiting for SW to be ready
                const swReady = await Promise.race([
                    navigator.serviceWorker.ready,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('SW Timeout')), 5000))
                ]).catch(err => {
                    console.error('FCM: ❌ Service Worker ready state timeout', err);
                    return null;
                });

                if (!swReady) return;
                console.log('FCM: ✅ Service Worker Registered & Ready');
            } catch (err) {
                console.error('FCM: ❌ Service Worker Setup Error:', err);
                return;
            }

            // Safe localStorage retrieval
            let sessionToken = null;
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
                const memberToken = localStorage.getItem('userToken');
                sessionToken = adminInfo?.token || memberToken || userData?.token;
            } catch (storageErr) {
                console.warn('FCM: ⚠️ LocalStorage access issues:', storageErr);
            }

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
                    const isAndroid = /Android/i.test(navigator.userAgent);
                    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
                    const adminInfoStore = JSON.parse(localStorage.getItem('adminInfo') || 'null');

                    let platform = 'web';
                    if (adminInfoStore) {
                        platform = 'web';
                    } else if (isIOS || isAndroid) {
                        platform = isStandalone ? 'pwa' : 'app';
                    }

                    console.log(`FCM: 📤 Syncing FCM Token via ${platform}...`);

                    const endpoint = adminInfoStore ? '/api/admin/auth/fcm-token' : '/api/user/auth/fcm-token';
                    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionToken}`
                        },
                        body: JSON.stringify({ token: fcmToken, platform })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            console.log('FCM: ✨ Token successfully synced with backend!');
                            isSynced.current = true;
                        } else {
                            console.error('FCM: ❌ Backend sync failed:', data.message);
                        }
                    }
                }
            } catch (err) {
                console.error('FCM: ❌ Critical Error during setup:', err);
            }
        };

        // Increase delay for iOS to allow the UI to fully load first
        const initDelay = isIOS ? 5000 : 3000;
        const timeoutId = setTimeout(setupFCM, initDelay);

        // Define a test function on the window
        window.triggerTestNotification = async () => {
            try {
                if (!('Notification' in window)) return;
                const registration = await navigator.serviceWorker.ready;
                if (!registration) return;

                if (Notification.permission !== 'granted') {
                    await Notification.requestPermission();
                }

                if (Notification.permission === 'granted') {
                    registration.showNotification('Test Pop-up ✅', {
                        body: 'If you see this, native popups are WORKING!',
                        icon: 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png',
                        requireInteraction: true
                    });
                }
            } catch (e) {
                console.error('FCM: Test failed', e);
            }
        };

        // Foreground listener
        let unsubscribe;
        try {
            unsubscribe = onMessageListener(async (payload) => {
                console.log('FCM: 📥 Message Received in Foreground:', payload);
                if (Notification.permission === 'granted') {
                    const registration = await navigator.serviceWorker.ready;
                    if (registration) {
                        registration.showNotification(payload.notification?.title || 'V10', {
                            body: payload.notification?.body || 'New message',
                            icon: 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png',
                            requireInteraction: true
                        });
                    }
                }
            });
        } catch (e) {
            console.warn('FCM: Failed to subscribe to foreground messages', e);
        }

        return () => {
            clearTimeout(timeoutId);
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return null;
};

export default FCMHandler;
