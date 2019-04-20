const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 群组数据模式
const UserGroupSchema = new Schema({
  user_id: String,
  group_id: String,
  level: Number,
  join_at: Date,

  // 群信息： * 待完善
  nickname: String,   // 群昵称
});

//数据模型
const UserGroup = mongoose.model('UserGroup', UserGroupSchema)

module.exports = UserGroup;
