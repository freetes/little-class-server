const router = require('express').Router();
const home = require('../controller/Home');

/* GET home page. */
router.get('/', home.index);
router.get('/test', home.test);

module.exports = router;
