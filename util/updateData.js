
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
    Models.UserGroup.updateMany({}, {view_count: 1}, (err, data)=>{
      console.log(err)
      console.log(data)
    })
  }
});
