const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

// User Model
const User = new Schema({
    firstName:String,
    lastName:String,
    email:{type:String , unique:true},
    password:String,
})


//Course Model
const Course = new Schema({
    title : String,
    description: String,
    price: Number,
    imageUrl: String,
    createrId: ObjectId
})



//Admin Model
const Admin = new Schema({
    firstName:String,
    lastName:String,
    email:{type:String , unique:true},
    password:String,
})


//Purchase Model
const Purchase = new Schema({
    courseId : ObjectId,
    userId : ObjectId
})


const UserModel = mongoose.model('users',User);
const CourseModel = mongoose.model('courses',Course);
const AdminModel = mongoose.model('admin',Admin);
const PurchaseModel = mongoose.model('purchase',Purchase);


module.exports = {
    UserModel,
    CourseModel,
    AdminModel,
    PurchaseModel
}