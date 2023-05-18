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
const saveDataNinox = require('../utils/saveDataToNinox');

const token = FACEBOOK_USER_ACCESS_TOKEN;

const getAdname = async (adId) => {
    try {
        const response = await axios.get(`https://graph.facebook.com/v16.0/${adId}?fields=name&access_token=${token}`);

        return response.data.name;
    } catch (err) {
        console.log(err.response);
        return '';
    }
};

const getDate = () => {
    // Create a new Date object
    const date = new Date();

    // Get the month, day, year, hours, and minutes from the date
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Determine whether it's AM or PM and convert the hours to 12-hour format
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    // Create the formatted date string
    const formattedDate = `${month}/${day}/${year} ${hours12}:${minutes} ${amOrPm}`;

    return formattedDate;
};

const getFilterFunction = (fieldData) => {
    return (nameValue) => {
        for (let i = 0; i < fieldData.length; i++) {
            if (fieldData[i].name === nameValue) {
                return fieldData[i].values[0];
            }
        }
        return '';
    };
};

const getLeadData = async (leadgenId, ad_id) => {
    const response = await axios.get(`https://graph.facebook.com/v16.0/${leadgenId}?access_token=${token}`);

    const data = response.data;

    console.log(data.field_data);

    const getValuesFromNameKey = getFilterFunction(data.field_data);

    //     Nome: 'first_name',
    //     Conome: 'last_name',
    //     Email: 'email',
    //     Phone: 'phone_number',
    // };

    //     'Città di Partenza': 'partenza_da?',
    //     'Tipi di camera': 'tipologia_della_camera',
    //     'Periodo Soggiorno': 'periodo_del_soggiorno',
    //     'Note Richiesta': 'indicaci_informazioni_del_soggiorno.',

    let leadDataAngrafiche = {
        Nome: getValuesFromNameKey('first_name'),
        Conome: getValuesFromNameKey('last_name'),
        Email: getValuesFromNameKey('email'),
        Phone: getValuesFromNameKey('phone_number'),
    };
    let leadDataPR_FB = {
        Modulo: await getAdname(ad_id),
        'Data e Ora': getDate(),
        'Città di Partenza': getValuesFromNameKey('partenza_da?'),
        'Tipi di camera': getValuesFromNameKey('tipologia_della_camera'),
        'Periodo Soggiorno': getValuesFromNameKey('periodo_del_soggiorno'),
        'Note Richiesta': getValuesFromNameKey('indicaci_informazioni_del_soggiorno.'),
    };

    return {
        leadDataAngrafiche,
        leadDataPR_FB,
    };
};

// gets webhook signal from facebook leads
const facebookWebhookController = async (req, res) => {
    try {
        const payload = req.body;

        const entry = payload.entry[0];

        const changes = entry.changes[0];
        const value = changes.value;
        console.log(value);

        const leadData = await getLeadData(value.leadgen_id, value.ad_id);
        console.log(leadData);

        await saveDataNinox(leadData);

        // const data = { ...leadData };

        return res.sendStatus(200);
    } catch (err) {
        if (err.response) {
            console.log(err.response);
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
