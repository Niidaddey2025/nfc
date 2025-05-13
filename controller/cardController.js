const axios = require('axios');
const verifyCardNumber = async (req, res) => {
    const { cardNumber } = req.body;
     const { EXTERNAL_API_URL, EXTERNAL_API_USERNAME, EXTERNAL_API_PASSWORD } = process.env;
     const apiUrl = `${EXTERNAL_API_URL}${encodeURIComponent(cardNumber)}`;
    

if (!EXTERNAL_API_URL || !EXTERNAL_API_USERNAME || !EXTERNAL_API_PASSWORD) {
    console.error('Error: Missing required environment variables for external API.');
    process.exit(1); // Exit if credentials are not set
}
    if(!cardNumber) {
        return res.status(400).json({ message: 'Card number is required.' });
    }
        try {
        const response = await axios.get(apiUrl, {
            auth: {
                username: EXTERNAL_API_USERNAME,
                password: EXTERNAL_API_PASSWORD
            }
        });
        console.log('External API Response Status:', response.status);
        console.log('External API Response Data:', response.data);
        if (response.data && response.data.items && response.data.items.length > 0) {
            res.json({ valid: true, data: response.data.items[0] });
        } else {
            // Even if the status is 200, if items array is empty, consider it invalid
            res.status(404).json({ valid: false, message: 'Invalid Card or Card Not Found' });
        }

    } catch (error) {
        console.error('Error calling external API:', error.message);
        if (error.response) {
            console.error('External API Error Status:', error.response.status);
            console.error('External API Error Data:', error.response.data);
            if (error.response.status === 404) {
                 res.status(404).json({ valid: false, message: 'Invalid Card or Card Not Found (API 404)' });
            } else {
                 res.status(error.response.status || 500).json({
                    message: 'Failed to validate card with external service.',
                    error: error.response.data || error.message
                });
            }
        } else {
            // Network error or other issue not directly from an API response
            res.status(500).json({ message: 'Failed to connect to external card validation service.' });
        }
    }
    return res.status(200).json({ message: 'Card number is valid.' });
}

module.exports = verifyCardNumber;
