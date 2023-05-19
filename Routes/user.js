const express = require('express');
const login = require('../controllers/auth/loginUser');
const signup = require('../controllers/auth/registerUser');
const authProtect = require('../middleware/authProtect');

const router = express.Router();

// router.post('/register', signup);
router.get('/', authProtect, (req, res) => {
    return res.status(200).json({ user: { email: req.user.email } });
});

router.post('/login', login);

const userRouter = router;

module.exports = userRouter;
