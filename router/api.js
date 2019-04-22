const router = require('express').Router();
const api = require('../controller/Api');

/* GET api page. */
router.post('/login', api.login);
router.post('/getUserInfoById', api.getUserInfoById);
router.post('/setUserInfo', api.setUserInfo);

router.post('/createGroup', api.createGroup);
router.post('/searchGroupByCode', api.searchGroupByCode);
router.post('/getGroupInfoById', api.getGroupInfoById);
router.post('/getAllGroupsByUserId', api.getAllGroupsByUserId);
router.post('/joinGroup', api.joinGroup);
router.post('/exitGroup', api.exitGroup);
router.post('/disbandGroup', api.disbandGroup);

router.post('/createCheckForm', api.createCheckForm);
router.post('/getGroupCheckForms', api.getGroupCheckForms);
router.post('/getCheckFormById', api.getCheckFormById);
router.post('/getChecksByCheckFormId', api.getChecksByCheckFormId);

router.post('/createCheck', api.createCheck);

router.post('/createOneWord', api.createOneWord);
router.post('/getOneWordById', api.getOneWordById);
router.post('/getOneWords', api.getOneWords);

module.exports = router;
