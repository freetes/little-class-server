const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 通知数据模式
const NoticeSchema = new Schema({
  user_id: String,
  group_id: String,

  title: String,
  content: String,

  // 浏览次数
  view_count: {
    type: Number,
    default: 1
  },

  create_at: Date,
  update_at: Date,
});

//数据模型
const Notice = mongoose.model('Notice', NoticeSchema)

module.exports = Notice;
