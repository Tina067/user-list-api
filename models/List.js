// models/List.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: String,
  defaultValue: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  properties: mongoose.Schema.Types.Mixed,
});

const listSchema = new mongoose.Schema({
  title: String,
  properties: [propertySchema],
  users: [userSchema],
});

const List = mongoose.model('List', listSchema);
export default List;
