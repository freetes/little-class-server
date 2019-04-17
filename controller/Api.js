const Models = require('../model/dataModel');

// 处理主页的请求
const Api = {
  // POST /login
  login: async (req, res)=>{
    // 搜索用户
    let user = await Models.User.find({openid: req.body.openid})

    // 用户存在
    if(user.length == 0){
      return res.json({
        result: true,
        message: '获取用户信息成功！',
        data: user[0]
      })
    }

    // 用户不存在，新建
    user = await Models.User.create({
      openid: req.body.openid,
      name: req.body.wxInfo.nickname,
      gender: req.body.wxInfo.gender,

      wxInfo: req.body.wxInfo,
      createAt: Date.now()
    })

    return res.json({
      result: true,
      message: '获取用户信息成功！',
      data: user
    })
  },
  // POST /setUserInfo
  setUserInfo: (req, res)=>{

    let user = await Models.User.findOneAndUpdate(
      {openid: req.body.openid},
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
};

module.exports = Api;
