const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

let client;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
} else {
    console.warn("Twilio credentials missing. SMS functionality will be disabled.");
}

exports.sendSMS = async (to, body) => {
    if (!client) {
        console.warn("Twilio client is not initialized.");
        return { success: false, error: "Twilio not configured" };
    }

    try {
        const message = await client.messages.create({
            body: body,
            from: fromNumber,
            to: to
        });
        console.log(`SMS sent to ${to}: ${message.sid}`);
        return { success: true, messageSid: message.sid };
    } catch (error) {
        console.error(`Failed to send SMS to ${to}:`, error);
        return { success: false, error: error.message };
    }
};
