var express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home')
});

router.get('/contagem', (req, res) => {
    res.render('contagem');
});

router.get('/contagem/:id', (req, res) => {
    var id = req.params.id;
    var data = [];

    console.log('id ->', id);
    res.render('contagem', data);
});

module.exports = router;