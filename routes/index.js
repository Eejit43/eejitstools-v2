const express = require('express');
const app = require('../app');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

module.exports = router;
