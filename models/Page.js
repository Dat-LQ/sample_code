const mongoose =require('mongoose') ;
const { Schema } = mongoose;

const Page = new Schema({
  _id: {type: Number},
  name: {type: String, required: true},
  type: {type: String, maxlength: 600},
});
module.exports = mongoose.model('Page', Page)