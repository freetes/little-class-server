const router = require('express').Router();
const api = require('../controller/Api');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

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
router.post('/getCheckFormsByGroupId', api.getCheckFormsByGroupId);
router.post('/getCheckFormById', api.getCheckFormById);
router.post('/getChecksByCheckFormId', api.getChecksByCheckFormId);

// Check
router.post('/createCheck', api.createCheck);

// OneWord
router.post('/createOneWord', api.createOneWord);
router.post('/getOneWordById', api.getOneWordById);
router.post('/getOneWords', api.getOneWords);

// Note
router.post('/createNote', multipartMiddleware, api.createNote);
// router.post('/editNote', api.editNote);
// router.post('/deleteNote', api.deleteNote);
router.post('/getAllNotes', api.getAllNotes);
router.post('/getNoteById', api.getNoteById);
router.post('/getNotesByUserId', api.getNotesByUserId);
// router.post('/createComment', api.createComment);


// 集成
// router.post('/', api)

module.exports = router;
