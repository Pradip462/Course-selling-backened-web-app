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
    createrId: {
        type : ObjectId,
        ref : "Admin",
        required:true
    },
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
    courseId : {
        type : ObjectId,
        ref : "Course",
        required:true
    },
    userId : {
        type : ObjectId,
        ref : "User",
        required : true
    },
})


const UserModel = mongoose.model('users',User);
const CourseModel = mongoose.model('courses',Course);
const AdminModel = mongoose.model('admins',Admin);
const PurchaseModel = mongoose.model('purchases',Purchase);


module.exports = {
    UserModel,
    CourseModel,
    AdminModel,
    PurchaseModel
}