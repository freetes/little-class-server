const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户数据模式
const UserSchema = new Schema({
  openid: String,
  wxInfo: {
    nickName: String,
    gender: Number,
    city: String,
    avatarUrl: String,
  },
  name: String,
  gender: Number,
  email: String,

  createAt: Date,
  updateAt: Date
});

//数据模型
const User = mongoose.model('User', UserSchema)

module.exports = User;
