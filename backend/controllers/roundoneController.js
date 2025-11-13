import Questions from "../models/roundonemodels.js"
import steg from "../models/stegmodels.js"
const addqn=async(req,res)=>{
    try{
        const {title,descp,qn,ans,type,yr}=req.body;
        if (!title || !descp || !qn || !ans || !type || !yr) {
        return res.status(400).json({
            "success": false,
            "message": 'Mising fields in request',
        });
        }
        const newqn=new Questions({title,descp,qn,ans,type,yr});
        const existingqn=await Questions.findOne({
            $or:[{title},{qn}]
        });
        if(existingqn){
            return res.status(409).json({
                "success":false,
                "message":"Already Exist"
            });
        }
        const savedqn=await newqn.save();
        res.status(201).json({
            "success": true,
            "message": "Question added successfully",
            "data": {
                _id: savedqn._id,
                title: savedqn.title,
                descp: savedqn.descp,
                qn: savedqn.qn,
                ans: savedqn.ans,
                type: savedqn.type,
                yr: savedqn.yr
            },
        });
    }
    catch(error){
        res.status(500).json({
            "success":false,
            "message":'internal server error',
        });
    }
};
const stegqnadd=async(req,res)=>{
    try{
        const {title,descp,qn,ans,type,yr,url}=req.body;
        if (!title || !descp || !qn || !ans || !type || !yr || !url) {
        return res.status(400).json({
            "success": false,
            "message": 'Mising fields in request',
        });
        }
        const newqn=new steg({title,descp,qn,ans,type,yr,url});
        const savedqn= await newqn.save();
        res.status(200).json({
            "success":true,
            "message":"Question added successfully",
            "data":{
                _id:savedqn._id,
                title: savedqn.title,
                descp: savedqn.descp,
                qn: savedqn.qn,
                ans: savedqn.ans,
                type: savedqn.type,
                yr: savedqn.yr,
                url:savedqn.url
            },
        })
    }
    catch(error){
        res.status(500).json({
            "success":false,
            "message": "internal server error"
        })
    }
}
const getstegqnbyyear=async(req,res)=>{
    try{
        const {yr}=req.query;

        
        if(!yr){
            return res.status(400).json({
                "success":false,
                "message":"Please provide a year",
            });
        }
        const filter={yr:yr};
        const questions=await steg.find(filter);
        if(questions.length==0){
            return res.status(404).json({
                "success":false,
                "message":"No question given for the provided year"
            })
        }
        res.status(200).json({
            "success":true,
            "count":questions.length,
            "data":questions,
        });
    }
    catch(error){
        res.status(500).json({
            "success": false,
            "message":"internal server error"
        });
    }
}
const getallquestion=async(req,res)=>{
    try{
        const {yr}=req.query;

        
        if(!yr){
            return res.status(400).json({
                "success":false,
                "message":"Please provide a year",
            });
        }
        const filter={yr:yr};
        const questions=await Questions.find(filter);
        if(questions.length==0){
            return res.status(404).json({
                "success":false,
                "message":"No question given for the provided year"
            })
        }
        res.status(200).json({
            "success":true,
            "count":questions.length,
            "data":questions,
        });
    }
    catch(error){
        res.status(500).json({
            "success": false,
            "message":"internal server error"
        });
    }
}
const getqnbyId=async(req,res)=>{
    try{
        const filter={};
        
        const{id}=req.params;
        const questions=await Questions.findById(id);
        if(!questions){
            return res.status(404).json({
                "success":false,
                "message":"Question not found"
            })
        }
        res.status(200).json({
            "success":true,
            "data":questions
        });
    }
    catch(error){
        res.status(500).json({
            "success":false,
            "message":"internal server error"
        });
    }
}
const updateqn=async(req,res)=>{
    try{
        const {id}=req.params;
        const {title,descp,qn,ans,type,yr}=req.body;
        const existingqn=await Questions.findOne({
            $or:[{title},{qn}]
        });
        if(existingqn){
            return res.status(409).json({
                "success":false,
                "message":"Already Exist"
            });
        }
        const updatedqn= await Questions.findByIdAndUpdate(
            id,
            {title,descp,qn,ans,type,yr},
            {new:true,runValidators: true}
        )
        if(!updatedqn){
            return res.status(404).json({success:false,message:"Invalid update fields or data"});
        }
        res.status(200).json({success:true,message:"question updated successfully",data:updatedqn});
    }
    catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}
module.exports={addqn,getallquestion,getqnbyId,updateqn,getstegqnbyyear,stegqnadd};