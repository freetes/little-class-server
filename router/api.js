const router = require('express').Router();
const api = require('../controller/Api');

/* GET api page. */
router.post('/login', api.login);
router.post('/setUserInfo', api.setUserInfo);

module.exports = router;
