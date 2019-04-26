const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 笔记数据模式
const NoteSchema = new Schema({
  user_id: String,

  title: String,
  content: String,

  position: String,

  filePath: String,

  // 浏览次数
  view_count: {
    type: Number,
    default: 1
  },

  // 私密性
  visible: {
    type: Boolean,
    default: false
  },

  tags: [String],
  create_at: Date,
  update_at: Date,
});

//数据模型
const Note = mongoose.model('Note', NoteSchema)

module.exports = Note;
