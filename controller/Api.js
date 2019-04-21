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

  // POST /getGroupInfoById
  getGroupInfoById: async (req, res)=>{

    // 查询群组
    let groupInfo = await Models.Group.findById(req.body.group_id)

    return res.json({
      result: true,
      message: '查询群组信息成功！',
      data: groupInfo
    })
  },

  // POST /joinGroupByGroupId
  joinGroupByGroupId: async (req, res)=>{
    // 查询群组
    // let groupInfo = await Models.Group.findById(req.body.group_id)

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

  // POST /exitGroupByGroupId
  exitGroupByGroupId: async (req, res)=>{
    // 查询群组
    // let groupInfo = await Models.Group.findById(req.body.group_id)

    // 删除群组-用户
    await Models.UserGroup.findOneAndRemove({group_id: req.body.groupId, user_id: req.body.userId})

    return res.json({
      result: true,
      message: '退出群组成功！',
      data: null
    })
  },

  // POST /disbandGroupByGroupId
  disbandGroupByGroupId: async (req, res)=>{
    let groupId = req.body.groupId, userId = req.body.userId

    // 修改群组状态
    await Models.Group.findByIdAndUpdate(groupId, {status: -2, update_at: Date.now()})

    // 删除群组-用户
    await Models.UserGroup.findOneAndRemove({group_id: groupId, user_id: userId})

    return res.json({
      result: true,
      message: '退出群组成功！',
      data: null
    })
  },

  // POST /getAllGroupsByUserId
  getAllGroupsByUserId: async (req, res)=>{
    let userId = req.body.userId

    let groupLogs = await Models.UserGroup.find({user_id: userId})

    let groups = []

    for(let log of groupLogs){
      let groupInfo = await Models.Group.findById(log.group_id)

      groups.push(groupInfo)
    }

    return res.json({
      result: true,
      message: '查询群组成功！',
      data: groups
    })
  },
};

module.exports = Api;
