const router = require('express').Router();
const api = require('../controller/Api');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// User
router.post('/login', api.login);
router.post('/getUserInfoById', api.getUserInfoById);
router.post('/setUserInfo', api.setUserInfo);
router.post('/getUsersByGroupId', api.getUsersByGroupId);

// Group
router.post('/createGroup', multipartMiddleware, api.createGroup);
router.post('/setGroupInfo', multipartMiddleware, api.setGroupInfo);
router.post('/searchGroupByCode', api.searchGroupByCode);
router.post('/getGroupInfoById', api.getGroupInfoById);
router.post('/getAllGroupsByUserId', api.getAllGroupsByUserId);
router.post('/joinGroup', api.joinGroup);
router.post('/editUserGroupInfo', api.editUserGroupInfo);
router.post('/exitGroup', api.exitGroup);
router.post('/disbandGroup', api.disbandGroup);
router.post('/getUserLevel', api.getUserLevel);
router.post('/getGroupChecksFile', api.getGroupChecksFile);

// CheckForm
router.post('/createCheckForm', api.createCheckForm);
router.post('/getCheckFormsByGroupId', api.getCheckFormsByGroupId);
router.post('/getCheckFormById', api.getCheckFormById);
router.post('/getChecksByCheckFormId', api.getChecksByCheckFormId);

// Check
router.post('/createCheck', api.createCheck);
router.post('/getUserChecks', api.getUserChecks);
router.post('/getGroupUserCheck', api.getGroupUserCheck);

// Note
router.post('/createNote', multipartMiddleware, api.createNote);
router.post('/editNote', multipartMiddleware, api.editNote);
router.post('/deleteNote', api.deleteNote);
router.post('/getAllNotes', api.getAllNotes);
router.post('/getNoteById', api.getNoteById);
router.post('/getNotesByUserId', api.getNotesByUserId);
router.post('/getNotesByGroupId', api.getNotesByGroupId);

// NoteComment
router.post('/createComment', api.createComment);
router.post('/deleteComment', api.deleteComment);
router.post('/getCommentsByNoteId', api.getCommentsByNoteId);

// Notice
router.post('/createNotice', api.createNotice);
router.post('/deleteNotice', api.deleteNotice);
router.post('/getNoticeById', api.getNoticeById);
router.post('/getNoticesByGroupId', api.getNoticesByGroupId);

// OneWord
router.post('/createOneWord', api.createOneWord);
router.post('/deleteOneWord', api.deleteOneWord);
// router.post('/getOneWordById', api.getOneWordById);
router.post('/getOneWordsByGroupId', api.getOneWordsByGroupId);

// 集成
// router.post('/', api)

module.exports = router;
