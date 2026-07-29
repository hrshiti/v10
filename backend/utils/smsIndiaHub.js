const axios = require('axios');

/**
 * SMSIndiaHub Service
 * Uses the working pushsms.aspx endpoint with correct param names
 */

const sendSms = async (mobile, message, options = {}) => {
    const apiKey = process.env.SMSINDIAHUB_API_KEY;
    const senderId = options.senderId || process.env.SMSINDIAHUB_SENDER_ID;

    console.log(`[SMS_DEBUG] sendSms called for: ${mobile}`);
    console.log(`[SMS_DEBUG] API Key exists: ${!!apiKey}, Sender ID: ${senderId}`);

    if (!apiKey || !senderId) {
        console.error('[SMS_DEBUG] Missing API Key or Sender ID in environment variables');
        return false;
    }

    try {
        // Prefix with 91 if it's a 10-digit number
        const msisdn = mobile.length === 10 ? `91${mobile}` : mobile;

        // Use the working pushsms endpoint with correct param names
        let url = `http://cloud.smsindiahub.in/vendorsms/pushsms.aspx` +
            `?APIKey=${apiKey}` +
            `&msisdn=${msisdn}` +
            `&sid=${senderId}` +
            `&msg=${encodeURIComponent(message)}` +
            `&fl=0` +
            `&gwid=2`;

        // Add PE ID and Template ID if available
        const peid = options.peid || process.env.SMSINDIAHUB_PE_ID;
        const templateId = options.templateId || process.env.SMSINDIAHUB_DLT_TEMPLATE_ID;

        if (peid) url += `&peid=${peid}`;
        if (templateId) url += `&templateid=${templateId}`;

        console.log(`[SMS_DEBUG] Request URL (masked key): ${url.replace(apiKey, '***')}`);

        const response = await axios.get(url);
        console.log(`[SMS_DEBUG] Response Status: ${response.status}`);
        console.log(`[SMS_DEBUG] Response Data:`, response.data);

        return true;

    } catch (error) {
        console.error(`[SMS_DEBUG] Request Failed: ${error.message}`);
        if (error.response) {
            console.error(`[SMS_DEBUG] Response Data:`, error.response.data);
        }
        return false;
    }
};

module.exports = sendSms;
