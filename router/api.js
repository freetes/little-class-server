const router = require('express').Router();
const api = require('../controller/Api');

/* GET api page. */
router.get('/login', api.login);
router.get('/setUserInfo', api.setUserInfo);

module.exports = router;
