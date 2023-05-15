const axios = require('axios').default;

const bizSdk = require('facebook-nodejs-business-sdk');
const Lead = bizSdk.Lead;

const {
    NINOX_API_KEY,
    NINOX_DATABASE_ID,
    NINOX_TABLE_ID,
    FACEBOOK_USER_ACCESS_TOKEN,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
} = require('../config/keys');

// gets webhook signal from facebook leads
const facebookWebhookController = async (req, res) => {
    try {
        const payload = req.body;

        const token = FACEBOOK_USER_ACCESS_TOKEN;

        const entry = payload.entry[0];

        const changes = entry.changes[0];
        const value = changes.value;

        const response = await axios.get(`https://graph.facebook.com/v16.0/${value.leadgen_id}?access_token=${token}`);

        const data = response.data;
        console.log('Data came from server');
        console.log(data);

        return res.sendStatus(200);
    } catch (err) {
        if (err.response) {
            console.log(err);
        } else {
            console.log(err);
        }

        res.sendStatus(400);
    }

    // Store the lead information in Ninox

    // const apiUrl = `https://api.ninoxdb.de/v1/${NINOX_DATABASE_ID}/${NINOX_TABLE_ID}`;
    // const headers = {
    //     Authorization: `Bearer ${NINOX_API_KEY}`,
    //     'Content-Type': 'application/json',
    // };

    // axios
    //     .post(apiUrl, leadData, { headers })
    //     .then((response) => {
    //         console.log('Lead stored in Ninox:', response.data);
    //         res.sendStatus(200);
    //     })
    //     .catch((error) => {
    //         console.error('Failed to store lead in Ninox', error);
    //         res.sendStatus(500);
    //     });
};

module.exports = facebookWebhookController;
