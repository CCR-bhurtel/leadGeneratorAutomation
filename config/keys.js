const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../', 'config.env') });

const NINOX_API_KEY = process.env.NINOX_API_KEY;
const NINOX_DATABASE_ID = process.env.NINOX_DATABASE_ID;
const NINOX_TABLE_ID = process.env.NINOX_TABLE_ID;
const PORT = process.env.PORT || 3000;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_APP_ACCESS_TOKEN;
const FACEBOOK_PAGE_ACCESS_TOKEN_TYPE = process.env.FACEBOOK_APP_ACCESS_TOKEN_TYPE;
const FACEBOOK_WEBHOOK_VERIFY_TOKEN = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN;
module.exports = {
    NINOX_API_KEY,
    NINOX_DATABASE_ID,
    NINOX_TABLE_ID,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    PORT,
    FACEBOOK_PAGE_ACCESS_TOKEN,
    FACEBOOK_PAGE_ACCESS_TOKEN_TYPE,
    FACEBOOK_WEBHOOK_VERIFY_TOKEN,
};
