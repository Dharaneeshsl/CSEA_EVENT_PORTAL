import mongoose from 'mongoose';
const qnsans= new mangoose.schema({
    title:{type: String ,required:true,trim:true},
    descp:{type: String ,required:true,trim:true},
    qn:{type: String ,required:true,trim:true},
    ans:{type: String ,required:true,trim:true},
    type:{type:String,enum:['riddle','quiz','unscrambled','binary']},
    yr:{type:Number,enum:[1,2]}
})

const roundone=mongoose.model('roundone',qnsans);
export default roundone