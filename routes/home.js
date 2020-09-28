var express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home')
});


router.get('/contagem', (req, res) => {
    res.render('contagem');
});

module.exports = router;