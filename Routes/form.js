const express = require('express');
const deleteForm = require('../controllers/form/deleteForm');
const postForm = require('../controllers/form/postForm');
const authProtect = require('../middleware/authProtect');
const getForms = require('../controllers/form/getForms');
const searchForm = require('../controllers/form/searchForm');

const router = express.Router();

router.delete('/:id', deleteForm);

router.post('/', postForm);

router.get('/', getForms);
router.get('/search', searchForm);

const formRouter = router;

module.exports = formRouter;
