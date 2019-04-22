const router = require('express').Router();
const api = require('../controller/Api');

/* GET api page. */
router.post('/login', api.login);
router.post('/getUserInfoById', api.getUserInfoById);
router.post('/setUserInfo', api.setUserInfo);

router.post('/createGroup', api.createGroup);
router.post('/searchGroupByCode', api.searchGroupByCode);
router.post('/getGroupInfoById', api.getGroupInfoById);
router.post('/joinGroupByGroupId', api.joinGroupByGroupId);
router.post('/exitGroupByGroupId', api.exitGroupByGroupId);
router.post('/disbandGroupByGroupId', api.disbandGroupByGroupId);
router.post('/getAllGroupsByUserId', api.getAllGroupsByUserId);

router.post('/createCheckForm', api.createCheckForm);
router.post('/getGroupCheckForms', api.getGroupCheckForms);
router.post('/getCheckFormById', api.getCheckFormById);
router.post('/getChecksByCheckFormId', api.getChecksByCheckFormId);

router.post('/createCheck', api.createCheck);

module.exports = router;
