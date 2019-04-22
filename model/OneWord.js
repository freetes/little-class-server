const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 一言数据模式
const OneWordSchema = new Schema({
  user_id: String,

  title: String,
  subtitle: String,
  content: String,
  position: String,

  create_at: Date,
  end_at: Date,
});

//数据模型
const OneWord = mongoose.model('OneWord', OneWordSchema)

module.exports = OneWord;
