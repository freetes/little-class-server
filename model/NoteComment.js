const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 笔记评论模式
const NoteCommentSchema = new Schema({
  note_id: String,
  user_id: String,

  feeling: String,
  /**
   * @happy 😄
   * @sad 😕
   * @good 👍
   * @bad 👎
   * @hooray 🎉
   * @eyes 👀
   */
  content: String,

  create_at: Date,
});

// 数据模型
const NoteComment = mongoose.model('NoteComment', NoteCommentSchema)

module.exports = NoteComment;
