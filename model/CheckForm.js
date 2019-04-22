const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 群组数据模式
const CheckFormSchema = new Schema({
  title: String,
  position: String,
  distance: Number,
  group_id: String,
  user_id: String,
  create_at: Date,
  end_at: Date,
  code: Number,
});

//数据模型
const CheckForm = mongoose.model('CheckForm', CheckFormSchema)

module.exports = CheckForm;
