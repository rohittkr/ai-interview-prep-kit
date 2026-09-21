import mongoose from 'mongoose';
const UserSchema=new mongoose.Schema({email:{type:String,unique:true,index:true},passwordHash:String},{timestamps:true});
const KitSchema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',index:true},name:String,kit:Object,practice:{type:Object,default:{}}},{timestamps:true});
export const User=mongoose.models.User||mongoose.model('User',UserSchema); export const KitModel=mongoose.models.Kit||mongoose.model('Kit',KitSchema);
