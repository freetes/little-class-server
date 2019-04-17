const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 群组数据模式
const CheckSchema = new Schema({
  form_id: String,
  user_id: String,
  position: String,
  check_at: Date,
  status: Number,
});

//数据模型
const Check = mongoose.model('Check', CheckSchema)

module.exports = Check;
