const router = require('express').Router();
const api = require('../controller/Api');

/* GET api page. */
router.post('/login', api.login);
router.post('/setUserInfo', api.setUserInfo);

router.post('/createGroup', api.createGroup);
router.post('/getGroupInfoById', api.getGroupInfoById);
router.post('/joinGroupByGroupId', api.joinGroupByGroupId);
router.post('/exitGroupByGroupId', api.exitGroupByGroupId);
router.post('/disbandGroupByGroupId', api.disbandGroupByGroupId);
router.post('/getAllGroupsByUserId', api.getAllGroupsByUserId);

module.exports = router;
