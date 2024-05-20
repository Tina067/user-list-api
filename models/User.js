// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  properties: Map,
});

const User = mongoose.model('User', userSchema);
export default User;
