const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 弹幕数据模式
const OneWordSchema = new Schema({
  user_id: String,
  group_id: String,

  content: String,

  create_at: Date,
});

//数据模型
const OneWord = mongoose.model('OneWord', OneWordSchema)

module.exports = OneWord;
