const axios = require('axios');

const FACEBOOK_APP_ID = '202794709214731';
const FACEBOOK_APP_SECRET = '99c21e10e6f0453c3b260aa9d87bcd69';
axios
    .get(
        `https://graph.facebook.com/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=client_credentials`
    )
    .then((response) => {
        console.log(response.data);
    });
