const { NINOX_API_KEY, NINOX_DATABASE_ID, NINOX_SECOND_TABLE_ID, NINOX_TEAM_ID } = require('./config/keys');
const axios = require('axios').default;

const api_endpoint = 'https://api.ninoxdb.de/v1';

console.log(NINOX_DATABASE_ID, NINOX_API_KEY);
axios
    .get(
        `${api_endpoint}/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/F`,

        {
            headers: {
                Authorization: `Bearer ${NINOX_API_KEY}`,
            },
        }
    )
    .then((response) => {
        if (response.status === 200) {
            const table = response.data;
            console.log(table.fields);
        } else {
            console.log('Error retrieving tables:', response.data);
        }
    })
    .catch((error) => {
        console.log('Error retrieving tables:', error.message);
    });
