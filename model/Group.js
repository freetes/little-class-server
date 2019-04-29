const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 群组数据模式
const GroupSchema = new Schema({
  name: String,
  description: String,
  status: Number,
  code: Number,
  filePath: String,

  create_at: Date,
  update_at: Date,
});

//数据模型
const Group = mongoose.model('Group', GroupSchema)

module.exports = Group;
