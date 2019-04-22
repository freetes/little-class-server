const router = require('express').Router();
const api = require('../controller/Api');

/* GET api page. */

// User
router.post('/login', api.login);
router.post('/getUserInfoById', api.getUserInfoById);
router.post('/setUserInfo', api.setUserInfo);
router.post('/getUsersByGroupId', api.getUsersByGroupId);

// Group
router.post('/createGroup', api.createGroup);
router.post('/setGroupInfo', api.setGroupInfo);
router.post('/searchGroupByCode', api.searchGroupByCode);
router.post('/getGroupInfoById', api.getGroupInfoById);
router.post('/getAllGroupsByUserId', api.getAllGroupsByUserId);
router.post('/joinGroup', api.joinGroup);
router.post('/exitGroup', api.exitGroup);
router.post('/disbandGroup', api.disbandGroup);

// CheckForm
router.post('/createCheckForm', api.createCheckForm);
router.post('/getCheckFormsByGroupId', api.getCheckFormsLength);
router.post('/getGroupCheckForms', api.getGroupCheckForms);
router.post('/getCheckFormById', api.getCheckFormById);
router.post('/getChecksByCheckFormId', api.getChecksByCheckFormId);

// Check
router.post('/createCheck', api.createCheck);

// OneWord
router.post('/createOneWord', api.createOneWord);
router.post('/getOneWordById', api.getOneWordById);
router.post('/getOneWords', api.getOneWords);

module.exports = router;
