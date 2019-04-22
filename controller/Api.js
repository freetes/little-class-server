const Models = require('../model/dataModel');

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

  // POST /createGroup
  /**
   * @groupName
   * @description
   * @userId
   */
  createGroup: async (req, res)=>{
    let groupCode = await Models.Group.count({})

    // 新建群组
    let newGroup = await Models.Group.create({
      name: req.body.groupName,
      description: req.body.description,
      create_at: Date.now(),
      update_at: Date.now(),
      status: 0,
      code: groupCode + 10000
    })

    // 新建群组-用户
    await Models.UserGroup.create({
      user_id: req.body.userId,
      group_id: newGroup._id,
      level: 1,
      join_at: Date.now(),
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
    let groupId = req.body.groupId

    let group = await Models.Group.findByIdAndUpdate(groupId, req.body.groupInfo)

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
   * @userId
   */
  getGroupInfoById: async (req, res)=>{

    let groupId = req.body.groupId, userId = req.body.userId

    // 查询群组
    let groupInfo = await Models.Group.findById(groupId)
    // groupInfo = JSON.parse(JSON.stringify(groupInfo))

    let log = null
    if(userId){
      log = await Models.UserGroup.findOne({group_id: groupId, user_id: userId})
      groupInfo = groupInfo.toObject()
      groupInfo.userLevel = log.level
    }

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
    // 查询群组
    // let groupInfo = await Models.Group.findById(req.body.groupId)

    // 新建群组-用户
    let userGroupInfo = await Models.UserGroup.create({
      user_id: req.body.userId,
      group_id: req.body.groupId,
      level: 0,
      join_at: Date.now(),
    })

    return res.json({
      result: true,
      message: '加入群组成功！',
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
    await Models.UserGroup.findOneAndRemove({group_id: groupId})

    return res.json({
      result: true,
      message: '解散群组成功！',
      data: null
    })
  },

  // POST /getAllGroupsByUserId
  /**
   * @userId
   */
  getAllGroupsByUserId: async (req, res)=>{
    let userId = req.body.userId

    let groupLogs = await Models.UserGroup.find({user_id: userId})

    let groups = []

    for(let log of groupLogs){
      let groupInfo = await Models.Group.findById(log.group_id)
      
      groupInfo = groupInfo.toObject()
      groupInfo.userLevel = log.level

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

  // POST /getCheckFormsLength
  /**
   * @groupId
   */
  getCheckFormsLength: async (req, res)=>{
    let groupId = req.body.groupId

    let length = await Models.CheckForm.count({group_id: groupId})

    return res.json({
      result: true,
      message: '获取签到表数成功！',
      data: length
    })
  },

  // POST /getGroupCheckForms
  /**
   * @groupId
   */
  getGroupCheckForms: async (req, res)=>{
    let groupId = req.body.groupId

    let checkForms = await Models.CheckForm.find({group_id: groupId})

    return res.json({
      result: true,
      message: '获取签到表s成功！',
      data: checkForms
    })
  },
  
  // POST /getCheckFormById
  /**
   * @checkFormId
   */
  getCheckFormById: async (req, res)=>{
    let checkFormId = req.body.checkFormId

    let checkForm = await Models.CheckForm.findById(checkFormId)

    return res.json({
      result: true,
      message: '获取签到表成功！',
      data: checkForm
    })
  },

  // POST /getChecksByCheckFormId
  /**
   * @checkFormId
   */
  getChecksByCheckFormId: async (req, res)=>{
    let checkFormId = req.body.checkFormId

    let checks = await Models.Check.find({form_id: checkFormId})

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
    let checkFormId = req.body.checkFormId, userId = userId

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

  // POST /createOneWord
  /**
   * @userId
   * @content
   * @createAt
   */
  createOneWord: async (req, res)=>{
    let userId = req.body.userId

    let data = {
      user_id: userId,
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      
      create_at: Date.now()
      // position: req.body.position,
    }

    let oneWord = await Models.OneWord.create(data)

    return res.json({
      result: true,
      message: '发布一言成功！',
      data: oneWord
    })
  },

  // POST /getOneWordById
  /**
   * @wordId
   * @content
   * @createAt
   */
  getOneWordById: async (req, res)=>{
    let wordId = req.body.wordId

    let oneWord = await Models.OneWord.findById(wordId)

    return res.json({
      result: true,
      message: '查询一言成功！',
      data: oneWord
    })
  },

  // POST /getOneWords
  /**
   * @page
   * @limit
   */
  getOneWords: async (req, res)=>{
    let page = req.body.page || 1, limit = req.body.limit || 20

    let oneWords = await Models.OneWord.find({}).sort({_id: -1}).skip(page*limit).limit(20)

    return res.json({
      result: true,
      message: '获取一言成功！',
      data: oneWords
    })
  },
};

module.exports = Api;
