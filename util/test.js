var xlsx = require('node-xlsx').default;
var fs = require('fs');


const mongoose = require('mongoose');
const Models = require('../model/dataModel');

// 连接数据库
// const options = {
// 	user : "test",
//   pass : "123"
// }

mongoose.connect('mongodb://@120.78.187.88:27017/gray-class-db', err=>{
  if(err)
    console.log("Failed to connect MongoDB Server!");
  else{
    // POST /setUserInfo
  /**
   * @groupId String
   */
    
    let logs = await Models.UserGroup.find({group_id: req.body.groupId})
    let checkForms = await Models.CheckForm.find({group_id: groupId})

    let users = []

    for(let log of logs){
      let count = [0, 0, 0]

      for(let form of checkForms){
        count[0] = 
      }
      let user = await Models.User.findById(log.user_id)

      user = JSON.parse(JSON.stringify(user))
      user.userLevel = log.level
      user.nickname = log.nickname
      

      let groupId = req.body.groupId, userId = req.body.userId
  
  
      checkForms = JSON.parse(JSON.stringify(checkForms))
  
      for(let item of checkForms){
        let check = await Models.Check.find({form_id: item._id, user_id: userId})
  
        // 未签到
        if(check.length == 0){
          item.checkStatus = 0
        }
        else{
          item.checkStatus = check[0].status      
        }
      }
  
      users.push(user)
    }

    return res.json({
      result: true,
      message: '获取群员s信息成功！',
      data: users
    })
  }
});

const data = [['我们班的第一次导入'], ['姓名', '签到成功次数', '签到失败次数', '未签到次数']];



const range = {s: {c: 0, r:4 }, e: {c:0, r:0}}; // A1:A4
const options = {'!merges': [ range ]};

var buffer = xlsx.build([{name: "mySheetName", data: data}], options); // Returns a buffer

fs.writeFile('test.xlsx', buffer, (err)=>{
  console.log(err)
})