const express = require('express');

const facebookWebhookController = require('./hooks/facebookWebhook');
const ninoxWebHookController = require('./hooks/ninoxWebhook');
const { PORT, FACEBOOK_WEBHOOK_VERIFY_TOKEN } = require('./config/keys');

const fs = require('fs');
const path = require('path');
const userRouter = require('./Routes/user');
const formRouter = require('./Routes/form');
const authProtect = require('./middleware/authProtect');
const connectDB = require('./db/connect');
const errorController = require('./controllers/errorController');

const app = express();

// Define the route for the webhook endpoint

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/form', authProtect, formRouter);
app.get('/', (req, res) => {
    fs.createReadStream('index.html').pipe(res);
});

app.post('/logData', (req, res) => {
    console.log(req.body);
});

app.get('/facebookwebhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === FACEBOOK_WEBHOOK_VERIFY_TOKEN) {
        console.log('Webhook verified');
        res.status(200).send(challenge);
    } else {
        console.error('Verification failed. Invalid token.');
        res.sendStatus(403);
    }
});
app.get('/privacypolicy', (req, res) => {
    return res.send('<h2>Privacy policy</h2>');
});
app.get('/tos', (req, res) => {
    return res.send('<h2>Terms of service</h2>');
});
app.post('/facebookwebhook', facebookWebhookController);

app.post('/ninoxwebhook', ninoxWebHookController);

app.use(errorController);
// Start the server
connectDB()
    .then((res) => {
        console.log(res);
        app.listen(PORT, () => {
            console.log(`server is listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        process.exit(1);
    });
