const {
    NINOX_FIRST_TABLE_ID,
    NINOX_SECOND_TABLE_ID,
    NINOX_BASE_API,
    NINOX_DATABASE_ID,
    NINOX_TEAM_ID,
    NINOX_API_KEY,
} = require('../config/keys');
const sampleData = require('../db/sample');

const axios = require('axios').default;

// FIRST TABLE = anagrafiche, SECOND TABLE = PR FB
let baseNinoxTableURL = `${NINOX_BASE_API}/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables`;

const getRecordWithPhone = async (Phone) => {
    const response = await axios.post(
        `${baseNinoxTableURL}/${NINOX_FIRST_TABLE_ID}/record`,
        {
            D: Phone,
        },
        {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NINOX_API_KEY}` },
        }
    );
    const record = response.data;
    return record;
};

const postAnagrafiche = async (data) => {
    // create data if not
    const response = await axios.post(
        `${baseNinoxTableURL}/${NINOX_FIRST_TABLE_ID}/records`,
        {
            fields: { ...data },
        },
        {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NINOX_API_KEY}` },
        }
    );

    console.log('Record Posted: ', response.data);

    return response.data.id;
};

const postPrFb = async (data, firstTableRecordId) => {
    const response = await axios.post(
        `${baseNinoxTableURL}/${NINOX_SECOND_TABLE_ID}/records`,
        {
            fields: { ...data, 'Richieste moduli': firstTableRecordId },
        },
        {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NINOX_API_KEY}` },
        }
    );
    const record = response.data;
    return record.id;
};

const saveDataNinox = async ({ leadDataAngrafiche, leadDataPR_FB }) => {
    try {
        if (leadDataAngrafiche.Phone) {
            const returnedValue = await getRecordWithPhone(leadDataAngrafiche.Phone);
            // const secondTableRecordId = await postPrFb(leadDataPR_FB);

            if (Array.isArray(returnedValue) && returnedValue.length == 0) {
                // record not present
                console.log('Record not found');
                const first_id = await postAnagrafiche(leadDataAngrafiche);
                await postPrFb(leadDataPR_FB, first_id);
            } else if (returnedValue.id) {
                // record is present
                console.log('Record found');
                await postPrFb(leadDataPR_FB, returnedValue.id);
            } else if (Array.isArray(returnedValue) && returnedValue[0]) {
                // maybe record is present in an array
                await postPrFb(leadDataPR_FB, returnedValue[0].id);
            }
        } else {
            const first_id = await postAnagrafiche(leadDataAngrafiche);
            await postPrFb(leadDataPR_FB, first_id);
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// saveDataNinox(sampleData).catch((err) => {
//     console.log(err);
// });
module.exports = saveDataNinox;
