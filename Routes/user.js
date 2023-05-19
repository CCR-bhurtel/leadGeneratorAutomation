const express = require('express');
const login = require('../controllers/auth/loginUser');
const signup = require('../controllers/auth/registerUser');

const router = express.Router();

// router.post('/register', signup);

router.post('/login', login);

const userRouter = router;

module.exports = userRouter;
