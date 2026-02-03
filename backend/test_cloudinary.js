const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Standard Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function checkCloudinary() {
    console.log('--- Cloudinary Connection Test ---');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING');

    // Check if defaults are still there
    if (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
        console.log('\n❌ ERROR: You are using placeholder values!');
        console.log('Please go to backend/.env and replace "your_cloud_name", etc. with actual keys from Cloudinary.');
        return;
    }

    try {
        const result = await cloudinary.api.ping();
        console.log('\n✅ SUCCESS: Cloudinary connection established!');
        console.log('Result:', result);
    } catch (error) {
        console.log('\n❌ ERROR: Cloudinary connection failed!');
        const errorMsg = error.message || (error.error && error.error.message) || JSON.stringify(error);
        console.error('Details:', errorMsg);

        if (errorMsg.includes('Must supply')) {
            console.log('Tip: Missing credentials in .env');
        } else if (errorMsg.includes('Invalid API key') || errorMsg.includes('Unknown API key')) {
            console.log('Tip: Your API Key or Secret is wrong.');
        }
    }
}

checkCloudinary();
