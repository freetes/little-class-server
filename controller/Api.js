const Models = require('../model/dataModel');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const publicPath = path.join(__dirname, '../public'),
      filePath = path.join(publicPath, '/file/');

// 处理主页的请求
const Api = {
  // POST /login
  /**
   * @openid String
   * @wxInfo
   */
  login: async (req, res)=>{
    if(!req.body.openid || req.body.openid==''){
      return res.json({
        result: false,
        message: '请求数据错误！',
      })
    }

    // 搜索用户
    let user = await Models.User.find({openid: req.body.openid})
    
    // 用户存在
    if(user.length > 0){
      return res.json({
        result: true,
        message: '获取用户信息成功！',
        data: user[0]
      })
    }

    // 用户不存在，新建
    user = await Models.User.create({
      openid: req.body.openid,
      name: req.body.wxInfo.nickName,
      gender: req.body.wxInfo.gender,

      wxInfo: req.body.wxInfo,
      createAt: Date.now()
    })

    return res.json({
      result: true,
      message: '新建用户信息成功！',
      data: user
    })
  },

  // POST /getUserInfoById
  /**
   * @userId String
   */
  getUserInfoById: async (req, res)=>{
    let userId = req.body.userId

    let user = await Models.User.findById(userId)

    return res.json({
      result: true,
      message: '获取用户信息成功！',
      data: user
    })
  },

  // POST /setUserInfo
  /**
   * @userId String
   * @name
   * @gender
   * @email
   * @wxInfo
   */
  setUserInfo: async (req, res)=>{
    let user = await Models.User.findByIdAndUpdate(
      req.body.userId,
      {
        name: req.body.name,
        gender: req.body.gender,
        email: req.body.email,

        wxInfo: req.body.wxInfo,
        updateAt: Date.now()
      }
    )

    return res.json({
      result: true,
      message: '设置用户信息成功！',
      data: user
    })
  },

  // POST /setUserInfo
  /**
   * @groupId String
   */
  getUsersByGroupId: async (req, res)=>{
    
    let logs = await Models.UserGroup.find({group_id: req.body.groupId})

    let users = []

    for(let log of logs){
      let user = await Models.User.findById(log.user_id)

      user = JSON.parse(JSON.stringify(user))
      user.userLevel = log.level
      user.nickname = log.nickname
      
      users.push(user)
    }

    return res.json({
      result: true,
      message: '获取群员s信息成功！',
      data: users
    })
  },

  // POST /createGroup
  /**
   * @groupName
   * @description
   * @userId
   * @file
   */
  createGroup: async (req, res)=>{
    let userId = req.body.userId, file = {}
    
    let groupCode = await Models.Group.count({})
    let user = await Models.User.findById(userId)

    if(req.files && req.files.file){
      file = req.files.file
    }

    // 新建群组
    let newGroup = await Models.Group.create({
      name: req.body.groupName,
      description: req.body.description,
      create_at: Date.now(),
      update_at: Date.now(),
      status: 0,
      code: groupCode + 10000
    })

    // 操作图片
    if(file.size){
      let fileName = newGroup._id + '.' + file.path.split('.')[1]
      fs.renameSync(req.files.file.path, filePath + fileName)
      newGroup = await Models.Group.findByIdAndUpdate(newGroup._id, {filePath: '/file/' + fileName})
    }

    // 新建群组-用户
    await Models.UserGroup.create({
      user_id: userId,
      group_id: newGroup._id,
      level: 1,
      join_at: Date.now(),

      nickname: user.name
    })

    return res.json({
      result: true,
      message: '创建群组成功！',
      data: newGroup
    })
  },

  // POST /setGroupInfo
  /**
   * @groupInfo
   * @groupId
   */
  setGroupInfo: async (req, res)=>{
    let groupId = req.body.groupId, file = {}

    if(req.files && req.files.file){
      file = req.files.file
    }

    let group = await Models.Group.findByIdAndUpdate(groupId, req.body.groupInfo)

    // 操作图片
    if(file.size){
      let fileName = groupId + '.' + file.path.split('.')[1]
      fs.renameSync(req.files.file.path, filePath + fileName)
      group = await Models.Group.findByIdAndUpdate(groupId, {filePath: '/file/' + fileName})
    }

    return res.json({
      result: true,
      message: '修改群组信息成功！',
      data: group
    })
  },
  
  // POST /searchGroupByCode
  /**
   * @code
   */
  searchGroupByCode: async (req, res)=>{

    // 查询群组
    let groupInfo = await Models.Group.find({code: req.body.code})

    return res.json({
      result: true,
      message: '查询群组信息成功！',
      data: groupInfo
    })
  },

  // POST /getGroupInfoById
  /**
   * @groupId
   */
  getGroupInfoById: async (req, res)=>{

    let groupId = req.body.groupId

    // 查询群组
    let groupInfo = await Models.Group.findById(groupId)
    
    // 获取创建者信息
    let log = await Models.UserGroup.findOne({group_id: groupId, level: 1})
    let creater = await Models.User.findById(log.user_id)

    groupInfo = JSON.parse(JSON.stringify(groupInfo))

    groupInfo.creater = creater

    return res.json({
      result: true,
      message: '查询群组信息成功！',
      data: groupInfo
    })
  },

  // POST /joinGroup
  /**
   * @userId
   * @groupId
   */
  joinGroup: async (req, res)=>{
    let userId = req.body.userId

    let user = await Models.User.findById(userId)

    // 新建群组-用户
    let userGroupInfo = await Models.UserGroup.create({
      user_id: userId,
      group_id: req.body.groupId,
      level: 0,
      join_at: Date.now(),

      nickname: user.name
    })

    return res.json({
      result: true,
      message: '加入群组成功！',
      data: userGroupInfo
    })
  },

  // POST /editUserGroupInfo
  /**
   * @userId
   * @groupId
   * @nickname
   */
  editUserGroupInfo: async (req, res)=>{
    let userId = req.body.userId, groupId = req.body.groupId

    let userGroupInfo = await Models.UserGroup.findOneAndUpdate(
      {user_id: userId, group_id: groupId}, 
      {nickname: req.body.nickname}
    )

    return res.json({
      result: true,
      message: '编辑用户群组信息成功！',
      data: userGroupInfo
    })
  },

  // POST /exitGroup
  /**
   * @groupId
   * @userId
   */
  exitGroup: async (req, res)=>{
    // 查询群组
    // let groupInfo = await Models.Group.findById(req.body.groupId)

    // 删除群组-用户
    await Models.UserGroup.findOneAndRemove({group_id: req.body.groupId, user_id: req.body.userId})

    return res.json({
      result: true,
      message: '退出群组成功！',
      data: null
    })
  },

  // POST /disbandGroup
  /**
   * @groupId
   */
  disbandGroup: async (req, res)=>{
    let groupId = req.body.groupId, userId = req.body.userId

    // 修改群组状态
    await Models.Group.findByIdAndUpdate(groupId, {status: -2, update_at: Date.now()})

    // 删除群组-用户
    await Models.UserGroup.remove({group_id: groupId})

    return res.json({
      result: true,
      message: '解散群组成功！',
      data: null
    })
  },

  // POST /getUserLevel
  /**
   * @param groupId
   * @param userId
   */
  getUserLevel: async (req, res)=>{
    let groupId = req.body.groupId, userId = req.body.userId
    
    let log = await Models.UserGroup.findOne({group_id: groupId, user_id: userId})

    return res.json({
      result: true,
      message: '查询用户级别成功！',
      data: log.level || -1
    })
  },

  // POST /getAllGroupsByUserId
  /**
   * @userId
   */
  getAllGroupsByUserId: async (req, res)=>{
    let userId = req.body.userId

    let logs = await Models.UserGroup.find({user_id: userId}).sort({view_count: -1})

    let groups = []

    for(let log of logs){
      let groupInfo = await Models.Group.findById(log.group_id)
      let formCount = await Models.CheckForm.count({group_id: log.group_id})
      let userCount = await Models.UserGroup.count({group_id: log.group_id})

      let lastCheck = await Models.CheckForm.findOne({group_id: log.group_id}).sort({end_at: -1})
      
      groupInfo = groupInfo.toObject()
      groupInfo.userLevel = log.level
      groupInfo.formCount = formCount
      groupInfo.userCount = userCount

      if(lastCheck){
        groupInfo.lastEndAt = lastCheck.end_at
      }

      groups.push(groupInfo)
    }

    return res.json({
      result: true,
      message: '查询群组成功！',
      data: groups
    })
  },

  // POST /createCheckForm
  /**
   * @title
   * @position
   * @distance
   * @groupId
   * @userId
   * @code
   * @createAt
   * @endAt
   */
  createCheckForm: async (req, res)=>{
    let groupId = req.body.groupId, userId = req.body.userId

    let data = {
      title: req.body.title,
      position: req.body.position,
      distance: req.body.distance,
      group_id: groupId,
      user_id: userId,
      code: req.body.code,
      create_at: req.body.createAt,
      end_at: req.body.endAt
    }

    let checkForm = await Models.CheckForm.create(data)

    return res.json({
      result: true,
      message: '新建签到表成功！',
      data: checkForm
    })
  },

  // POST /getCheckFormsByGroupId
  /**
   * @groupId
   * @userId
   */
  getCheckFormsByGroupId: async (req, res)=>{
    let groupId = req.body.groupId, userId = req.body.userId

    let forms = await Models.CheckForm.find({group_id: groupId}).sort({_id: -1})

    forms = JSON.parse(JSON.stringify(forms))

    let user = await Models.UserGroup.findOne({group_id: groupId, user_id: userId})
    
    if(user){
      for(let form of forms){

        if(user.level == 1){
          let successCount = await Models.Check.count({form_id: form._id, status: 1})
          let failCount = await Models.Check.count({form_id: form._id, status: -1})
    
          form.successCount = successCount
          form.failCount = failCount
        }
        else{
          let check = await Models.Check.findOne({form_id: form._id, user_id: userId})
          
          if(check){
            form.checkStatus = check.status || 0
          }
        }
      }
    }
    
    return res.json({
      result: true,
      message: '获取签到表s成功！',
      data: forms
    })
  },

  // POST /getCheckFormById
  /**
   * @checkFormId
   */
  getCheckFormById: async (req, res)=>{
    let checkFormId = req.body.checkFormId

    let checkForm = await Models.CheckForm.findById(checkFormId)
    let group = await Models.Group.findById(checkForm.group_id)
    let users = await Models.UserGroup.find({group_id: checkForm.group_id})

    checkForm = JSON.parse(JSON.stringify(checkForm))
    checkForm.members = []

    for(let log of users){
      let user = await Models.User.findById(log.user_id)
      let check = await Models.Check.findOne({form_id: checkFormId, user_id: log.user_id})
      
      user = user.toObject()
      user.checkStatus = 0
      if(check){
        user.checkStatus = check.status
      }
      user.nickname = log.nickname
      user.userLevel = log.level
      
      checkForm.members.push(user)
    }

    return res.json({
      result: true,
      message: '获取签到表成功！',
      data: {
        checkForm,
        group,
      }
    })
  },

  // POST /getChecksByCheckFormId
  /**
   * @checkFormId
   */
  getChecksByCheckFormId: async (req, res)=>{
    let checkFormId = req.body.checkFormId

    let checks = await Models.Check.find({form_id: checkFormId}).sort({_id: -1})

    checks = JSON.parse(JSON.stringify(checks))

    for(let check of checks){
      let user = await Models.User.findById(check.user_id)

      check.userInfo = user
    }

    return res.json({
      result: true,
      message: '获取签到s成功！',
      data: checks
    })
  },

  // POST /createCheck
  /**
   * @checkFormId
   * @userId
   * @position
   * @checkAt
   * @status
   */
  createCheck: async (req, res)=>{
    let checkFormId = req.body.checkFormId, userId = req.body.userId

    let data = {
      form_id: checkFormId,
      user_id: userId,
      position: req.body.position,
      check_at: req.body.checkAt,
      status: req.body.status,
    }

    let check = await Models.Check.create(data)

    return res.json({
      result: true,
      message: '签到成功！',
      data: check
    })
  },

  // POST /createNote
  /**
   * @userId
   * @title
   * @content
   * @visible
   * @tags
   */
  createNote: async (req, res)=>{
    let userId = req.body.userId, groupId = req.body.groupId, file = {}
    
    if(req.files && req.files.file){
      file = req.files.file
    }

    let data = {
      group_id: groupId,
      user_id: userId,
      title: req.body.title,
      content: req.body.content,
      visible: JSON.parse(req.body.visible),
      tags: JSON.parse(req.body.tags),
      
      view_count: 1,
      create_at: Date.now()
    }

    let note = await Models.Note.create(data)

    // 操作图片
    if(file.size){
      let fileName = note._id + '.' + file.path.split('.')[1]
      fs.renameSync(req.files.file.path, filePath + fileName)
      note = await Models.Note.findByIdAndUpdate(note._id, {filePath: '/file/' + fileName})
    }

    return res.json({
      result: true,
      message: '发布笔记成功！',
      data: note
    })
  },

  // POST /editNote
  /**
   * @noteId
   * @title
   * @content
   * @visible
   * @tags
   */
  editNote: async (req, res)=>{
    let noteId = req.body.noteId, file = {}
    
    if(req.files && req.files.file){
      file = req.files.file
    }

    let data = {
      user_id: userId,
      title: req.body.title,
      content: req.body.content,
      visible: JSON.parse(req.body.visible),
      tags: JSON.parse(req.body.tags),
      
      update_at: Date.now()
    }

    // 操作图片
    if(file.size){
      let fileName = note._id + '.' + file.path.split('.')[1]
      fs.renameSync(req.files.file.path, filePath + fileName)

      data.filePath = '/file/' + fileName
    }
    
    note = await Models.Note.findByIdAndUpdate(noteId, data)

    return res.json({
      result: true,
      message: '更新笔记成功！',
      data: note
    })
  },

  // POST /deleteNote
  /**
   * @noteId
   */
  deleteNote: async (req, res)=>{
    let noteId = req.body.noteId

    let note = await Models.Note.findByIdAndDelete(noteId)

    return res.json({
      result: true,
      message: '删除笔记成功！',
      data: note
    })
  },

  // POST /getAllNotes
  /**
   * @page
   * @limit
   */
  getAllNotes: async (req, res)=>{
    let page = req.body.page || 1, limit = req.body.limit || 20

    let notes = await Models.Note.find({visible: true})
                      .sort({_id: -1})
                      .skip((page-1)*limit)
                      .limit(20)

    return res.json({
      result: true,
      message: '获取公开笔记成功！',
      data: notes
    })
  },

  // POST /getNotesByUserId
  /**
   * @userId
   * @page
   * @limit
   */
  getNotesByUserId: async (req, res)=>{
    let userId = req.body.userId, 
        page = req.body.page || 1, 
        limit = req.body.limit || 20;

    let notes = await Models.Note.find({user_id: userId})
                      .sort({_id: -1})
                      .skip((page-1)*limit)
                      .limit(20)

    return res.json({
      result: true,
      message: '根据用户名查询笔记成功！',
      data: notes
    })
  },

  // POST /getNotesByGroupId
  /**
   * @groupId
   * @page
   * @limit
   */
  getNotesByGroupId: async (req, res)=>{
    let groupId = req.body.groupId, 
        page = req.body.page || 1, 
        limit = req.body.limit || 20;

    let notes = await Models.Note.find({group_id: groupId})
                      .sort({_id: -1})
                      .skip((page-1)*limit)
                      .limit(20)

    return res.json({
      result: true,
      message: '根据群组ID查询笔记成功！',
      data: notes
    })
  },

  // POST /getNoteById
  /**
   * @noteId
   */
  getNoteById: async (req, res)=>{
    let noteId = req.body.noteId

    let note = await Models.Note.findById(noteId)

    // 更新浏览次数
    note = await Models.Note.findByIdAndUpdate(noteId, {view_count: note.view_count+1})

    note = JSON.parse(JSON.stringify(note))

    let creater = await Models.User.findById(note.user_id)
    note.creater = creater
    
    return res.json({
      result: true,
      message: '根据id获取笔记成功！',
      data: note
    })
  },

  // POST /createComment
  /**
   * @nodeId
   * @userId
   */
  createComment: async (req, res)=>{
    let userId = req.body.userId, noteId = req.body.noteId

    let data = {
      note_id: noteId,
      user_id: userId,

      feeling: req.body.feeling,
      content: req.body.content,

      createAt: Date.now()
    }

    let noteComment = await Models.NoteComment.create(data)

    return res.json({
      result: true,
      message: '新增笔记评论成功！',
      data: noteComment
    })
  },

  // POST /deleteComment
  /**
   * @commentId
   */
  deleteComment: async (req, res)=>{
    let commentId = req.body.commentId

    let noteComment = await Models.NoteComment.findByIdAndDelete(commentId)

    return res.json({
      result: true,
      message: '删除笔记评论成功！',
      data: noteComment
    })
  },

  // POST /getCommentsByNoteId
  /**
   * @noteId
   */
  getCommentsByNoteId: async (req, res)=>{
    let noteId = req.body.noteId

    let comments = await Models.NoteComment.find({note_id: noteId})

    comments = JSON.parse(JSON.stringify(comments))

    for(let item of comments){
      let user = await Models.User.findById(item.user_id)

      item.userName = user.name
      item.avatarUrl = user.wxInfo.avatarUrl     
    }

    return res.json({
      result: true,
      message: '根据笔记id获取笔记评论成功！',
      data: comments
    })
  },

  // POST /createNotice
  /**
   * @userId
   * @groupId
   * @title
   * @content
   */
  createNotice: async (req, res)=>{
    let userId = req.body.userId, groupId = req.body.groupId
    
    let data = {
      group_id: groupId,
      user_id: userId,
      title: req.body.title,
      content: req.body.content,
      
      view_count: 1,
      create_at: Date.now()
    }

    let notice = await Models.Notice.create(data)

    return res.json({
      result: true,
      message: '发布通知成功！',
      data: notice
    })
  },

  // POST /deleteNotice
  /**
   * @noticeId
   */
  deleteNotice: async (req, res)=>{
    let noticeId = req.body.noticeId

    let notice = await Models.Notice.findByIdAndDelete(noticeId)

    return res.json({
      result: true,
      message: '删除通知成功！',
      data: notice
    })
  },

  // POST /getNoticeById
  /**
   * @noticeId
   */
  getNoticeById: async (req, res)=>{
    let noticeId = req.body.noticeId

    let notice = await Models.Notice.findById(noticeId)

    // 更新浏览次数
    notice = await Models.Notice.findByIdAndUpdate(noticeId, {view_count: notice.view_count+1})

    // 获取发布者信息
    creater = await Models.User.findById(notice.user_id)
    
    notice = JSON.parse(JSON.stringify(notice))
    notice.creater = creater

    return res.json({
      result: true,
      message: '获取通知成功！',
      data: notice
    })
  },

  // POST /getNoticesByGroupId
  /**
   * @groupId
   */
  getNoticesByGroupId: async (req, res)=>{
    let groupId = req.body.groupId

    let notices = await Models.Notice.find({group_id: groupId}).sort({_id: -1})

    return res.json({
      result: true,
      message: '获取通知s成功！',
      data: notices
    })
  },

  // POST /createOneWord
  /**
   * @userId
   * @groupId
   * @content
   */
  createOneWord: async (req, res)=>{
    let userId = req.body.userId, groupId = req.body.groupId
    
    let data = {
      group_id: groupId,
      user_id: userId,
      content: req.body.content,
      
      create_at: Date.now()
    }

    let oneWord = await Models.OneWord.create(data)

    return res.json({
      result: true,
      message: '发送弹幕成功！',
      data: oneWord
    })
  },

  // POST /deleteOneWord
  /**
   * @oneWordId
   */
  deleteOneWord: async (req, res)=>{
    let oneWordId = req.body.oneWordId

    let oneWord = await Models.OneWord.findByIdAndDelete(oneWordId)

    return res.json({
      result: true,
      message: '删除弹幕成功！',
      data: oneWord
    })
  },

  // POST /getOneWordsByGroupId
  /**
   * @param groupId
   * @param userId
   * @param time
   * @param count
   */
  getOneWordsByGroupId: async (req, res)=>{
    let groupId = req.body.groupId, time = null, userId = null

    if(req.body.time){
      time = new Date(req.body.time)
    }
    if(req.body.userId){
      userId = req.body.userId
    }

    // 获取弹幕
    let oneWords = await Models.OneWord.find(
      {
        group_id: groupId,
        user_id: {$ne: userId},
        create_at: {$gte: time},
      })
    
    // 获取创建者信息
    oneWords = JSON.parse(JSON.stringify(oneWords))
    for(let item of oneWords){
      item.creater = await Models.User.findById(item.user_id)
    }

    return res.json({
      result: true,
      message: '获取弹幕s成功！',
      data: oneWords
    })
  },

};

module.exports = Api;
