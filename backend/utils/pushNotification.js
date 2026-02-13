const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with the provided service account
const serviceAccount = require('../config/v10-fitness-lab-firebase-adminsdk-fbsvc-a3f986a929.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

/**
 * Send push notification to a specific token
 * @param {string} token - FCM registration token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Extra data to send with notification
 */
const sendPushNotification = async (token, title, body, data = {}) => {
    if (!token) {
        console.warn('Cannot send notification: No FCM token provided');
        return;
    }

    // Default icon (Gym Logo) - This should be a public URL
    // From previous knowledge, the logo is often hosted on Cloudinary
    const defaultIcon = 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png';

    const message = {
        notification: {
            title,
            body,
        },
        webpush: {
            notification: {
                icon: data.icon || defaultIcon,
                badge: data.icon || defaultIcon,
                click_action: data.click_action || '/',
            }
        },
        data: {
            ...data,
            icon: data.icon || defaultIcon
        },
        token: token
    };

    console.log(`FCM: Sending single notification to ${token.substring(0, 10)}...`);
    console.log('FCM: Payload:', JSON.stringify(message.notification));

    try {
        const response = await admin.messaging().send(message);
        console.log('FCM: ✅ Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('FCM: ❌ Error sending message:', error.message);
        return null;
    }
};

/**
 * Send push notification to multiple tokens
 * @param {Array} tokens - Array of FCM registration tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Extra data
 */
const sendMulticastNotification = async (tokens, title, body, data = {}) => {
    // De-duplicate tokens and filter out invalid ones
    const uniqueTokens = [...new Set(tokens || [])];
    const validTokens = uniqueTokens.filter(t => t && typeof t === 'string' && t.trim() !== '');

    if (validTokens.length === 0) return;

    const defaultIcon = 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png';

    const message = {
        notification: {
            title,
            body,
        },
        webpush: {
            notification: {
                icon: data.icon || defaultIcon,
                badge: data.icon || defaultIcon,
                click_action: data.click_action || '/',
            }
        },
        data: {
            ...data,
            icon: data.icon || defaultIcon
        },
        tokens: validTokens
    };

    console.log(`FCM: Sending multicast to ${validTokens.length} tokens...`);

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`FCM: ✅ ${response.successCount} messages sent. Failures: ${response.failureCount}`);
        return response;
    } catch (error) {
        console.error('FCM: ❌ Error sending multicast message:', error.message);
        return null;
    }
};

module.exports = {
    sendPushNotification,
    sendMulticastNotification
};
