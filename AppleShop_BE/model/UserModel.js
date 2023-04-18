const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, default: 0 },
  age: { type: String, required: true, default: 0 },
  gender: { type: String, require: true },
  dateofbirth: { type: String, required: true, default: 0},
  city: { type: String, require: true },
  address: { type: String, require: true },
  //token chỉ được dùng 1 lần để reset password, token có giới hạn thời gian sử dụng
  resetPassword: { type: String, required: false, default: null },
});

module.exports = mongoose.model('user', UserSchema);
