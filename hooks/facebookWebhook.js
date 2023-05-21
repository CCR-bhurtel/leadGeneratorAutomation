const axios = require('axios').default;
const Form = require('../models/Form');

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
                return fieldData[i].values[0].split('_').join(' ');
            }
        }
        return '-';
    };
};

const getLeadData = async (leadgenId, fields, formName = '') => {
    const response = await axios.get(`https://graph.facebook.com/v16.0/${leadgenId}?access_token=${token}`);

    const data = response.data;
    console.log(data.field_data);

    const getValuesFromNameKey = getFilterFunction(data.field_data);

    let leadDataAngrafiche = {};
    let leadDataPR_FB = {
        Modulo: formName,
        'Data e Ora': getDate(),
    };

    fields.anagrafiche.forEach((field) => {
        leadDataAngrafiche[field.ninoxField] = getValuesFromNameKey(field.facebookField);
    });
    fields.prFb.forEach((field) => {
        leadDataPR_FB[field.ninoxField] = getValuesFromNameKey(field.facebookField);
    });

    console.log({ leadDataAngrafiche, leadDataPR_FB });

    return {
        leadDataAngrafiche,
        leadDataPR_FB,
    };
};

const filterFields = (formFields) => {
    const anagrafiche = [];
    const prFb = [];
    formFields.forEach((field) => {
        if (field.tableType === 'basics') {
            anagrafiche.push(field);
        } else if (field.tableType === 'prFb') {
            prFb.push(field);
        }
    });
    return { anagrafiche, prFb };
};

// gets webhook signal from facebook leads
const facebookWebhookController = async (req, res) => {
    try {
        const payload = req.body;

        console.log(payload);

        const entry = payload.entry[0];

        const changes = entry.changes[0];
        const value = changes.value;
        console.log(value);
        const form = await Form.findOne({ formId: value.form_id });

        if (form) {
            const filteredFields = filterFields(form.formFields);
            const leadData = await getLeadData(value.leadgen_id, filteredFields, form.formName);

            await saveDataNinox(leadData); // ---------------------------this line----------------
            return res.sendStatus(200);
        } else {
            return res.sendStatus(400);
        }

        // const data = { ...leadData };
    } catch (err) {
        if (err.response) {
            console.log(err.response.data);
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
