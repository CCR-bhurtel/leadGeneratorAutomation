const express = require('express');

const dotenv = require('dotenv');
const facebookWebhookController = require('./hooks/facebookWebhook');
const ninoxWebHookController = require('./hooks/ninoxWebhook');
const postAdController = require('./controllers/postAdController');

dotenv.config({ path: path.resolve(__dirname, 'config.env') });

const app = express();

app.use(express.json()); // Parse JSON request bodies

// Define the route for the webhook endpoint
app.post('/facebookwebhook', facebookWebhookController);

app.post('/ninoxwebhook', ninoxWebHookController);

app.post('/ad', postAdController);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook server is listening on port ${PORT}`);
});
