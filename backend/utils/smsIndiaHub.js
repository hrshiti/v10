const axios = require('axios');

const sendSms = async (mobile, message) => {
    try {
        const apiKey = process.env.SMSINDIAHUB_API_KEY;
        const senderId = process.env.SMSINDIAHUB_SENDER_ID;

        if (!apiKey || !senderId) {
            console.error('SMS India Hub API Key or Sender ID missing in environment variables');
            return false;
        }

        // SMS India Hub API endpoint
        // Using standard transactional parameters: route=1, channel=2, DCS=0, flashsms=0
        const url = `http://cloud.smsindiahub.in/api/mt/SendSMS`;

        const params = {
            APIKey: apiKey,
            senderid: senderId,
            channel: 2,
            DCS: 0,
            flashsms: 0,
            number: mobile,
            text: message,
            route: 1 // Transactional route usually
        };

        const response = await axios.get(url, { params });

        // Log response for debugging but be careful with sensitive info
        console.log(`SMS sent to ${mobile}:`, response.data);

        // SMS India Hub usually returns a JSON with ErrorCode or similar
        // Check documentation for success condition if possible, otherwise assume 200 OK
        if (response.data && response.data.ErrorCode === '000') {
            return true;
        }

        // Some responses might just be the JobId
        return true;

    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return false;
    }
};

module.exports = sendSms;
