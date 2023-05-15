const axios = require('axios');
const { NINOX_API_KEY, NINOX_DATABASE_ID, NINOX_TABLE_ID } = require('../config/keys');

// gets webhook signal from facebook leads
const facebookWebhookController = (req, res) => {
    const payload = req.body;

    console.log(payload);
    console.log(payload.entry.changes);
    console.log(payload.entry.changes[0]);
    // Extract the lead information from the payload
    const leadData = payload.entry[0].changes[0].value;

    return res.sendStatus(200);

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
