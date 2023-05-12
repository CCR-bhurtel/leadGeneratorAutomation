const express = require('express');

const dotenv = require('dotenv');
const path = require('path');
const facebookWebhookController = require('./hooks/facebookWebhook');
const ninoxWebHookController = require('./hooks/ninoxWebhook');
const postAdController = require('./controllers/postAdController');
const { PORT } = require('./config/keys');

dotenv.config({ path: path.resolve(__dirname, 'config.env') });

const app = express();

app.use(express.json()); // Parse JSON request bodies

// Define the route for the webhook endpoint

// app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('<h1>Hello world in the name of law</h1>');
});
app.get('/facebookwebhook', (req, res) => {
    res.status(400).json({ message: 'success' });
});
app.post('/facebookwebhook', facebookWebhookController);

app.post('/ninoxwebhook', ninoxWebHookController);

app.post('/ad', postAdController);

// Start the server
app.listen(PORT, () => {
    console.log(`Webhook server is listening on port ${PORT}`);
});
