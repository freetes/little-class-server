const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 一言数据模式
const NoteSchema = new Schema({
  user_id: String,

  title: String,
  subtitle: String,
  content: String,

  position: String,

  filePath: String,

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
