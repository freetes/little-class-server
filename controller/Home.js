const Models = require('../model/dataModel');

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    return res.render('contents/hello')
  },
  // GET /test
  test: (req, res)=>{
    return res.json({
      result: true,
      message: 'Hello, world!'
    })
  },
};

module.exports = Home;
