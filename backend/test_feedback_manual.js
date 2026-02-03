const http = require('http');

function post(url, data, token = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
        });
        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
}

function get(url, token) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const req = http.get(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
        });
        req.on('error', reject);
    });
}

async function testFeedback() {
    const baseUrl = 'http://localhost:5000/api';

    try {
        console.log('--- Step 1: Logging in as User ---');
        const login = await post(`${baseUrl}/user/auth/verify-otp`, { mobile: '1234567890', otp: '123456' });
        const token = login.data.token;

        if (!token) {
            console.error('Login Failed!', login.data);
            return;
        }
        console.log('Login Success! Token obtained.');

        console.log('\n--- Step 2: Submitting Feedback ---');
        const feedback = await post(`${baseUrl}/user/feedback`, {
            type: 'Complaint',
            message: 'Testing Live Feedback: Music is too loud in the evening.',
            rating: 4
        }, token);
        console.log('Submission Result:', feedback.data);

        console.log('\n--- Step 3: Fetching History ---');
        const history = await get(`${baseUrl}/user/feedback`, token);
        console.log('Total Feedbacks in History:', history.data.length);
        console.log('Latest Feedback Message:', history.data[0].message);
        console.log('Generated Feedback ID:', history.data[0].feedbackId);
    } catch (e) {
        console.error('Test failed with error:', e.message);
    }
}

testFeedback();
