var express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home')
});

router.get('/contagem', (req, res) => {
    res.render('contagem');
});

router.get('/contagem/:id', (req, res) => {
    res.render('contagem');
});

module.exports = router;