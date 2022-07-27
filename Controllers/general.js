const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const Message = require('../models/message');
const { Op } = require("sequelize");
const UserGroup = require('../models/userGroup');
const Group = require('../models/group');

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const pNumber = req.body.pNumber;
  const password = req.body.password;
  User.count({where: {[Op.or]: [{ email: email },{ pNumber: pNumber }]}})
  .then(dupExists => { 
      if(dupExists){return res.json({success:0 , message:'User already exists'});}
      return bcrypt.hash(password,12).then(hashedPassword =>{
        User.create({name:name,email:email,pNumber:pNumber,password:hashedPassword})
        .then(result => {return res.json({success:1,  message:'Signup Successful'})}) }) 
    }).catch(err => {console.log(err)});   
  }

exports.postSignin = (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  User.findOne({where:{email: email}})
  .then(exists => { 
    if(!exists){return res.status(404).json({success:0,message:'User not found'});} 
    bcrypt.compare(password,exists.password)
    .then(doMatch => {if(doMatch) {
      const jwtoken = jwt.sign(exists.id, process.env.TOKEN_SECRET);
      return res.json({success:1,token:jwtoken}); } 
    res.status(401).json({success:0, message:'User unauthorized'})  })
    .catch(err => {console.log(err); res.json({success:0, message:'Something went wrong'});})  
  }).catch(err => {console.log(err)})
  }

exports.authenticate = (req,res,next) => {
  const token = req.header('authorization')
  const userid = Number(jwt.verify(token,process.env.TOKEN_SECRET))
  User.findByPk(userid).then(user => {
    req.user=user;
    next();
  }).catch(err => {console.log(err)})
}

exports.postMessage = (req, res, next) => {
  req.user.createMessage({message : req.body.message})
  .then(() => res.json({success:1}))
  .catch(err => {console.log(err);res.json({success:0})})
}

exports.getMessages = async (req, res, next) => {
  let latestId = await Message.max('id');
  let lastMessageId = req.query.lastMessageId;
  if(lastMessageId===undefined|| lastMessageId===null) lastMessageId=-1;
  Message.findAll({where: {id: {[Op.gt]: lastMessageId}}, attributes:{exclude:['userId','createdAt','updatedAt']},include:{model:User, attributes:['name']}})
  .then(messages => {res.json({messages,lastMessageId:latestId})})
  .catch(err => {console.log(err);});
}

//Inividual Groups and msgs
exports.postGroup = async (req, res, next) => {
  try 
  { 
    const group = await req.user.createGroup({gname:req.body.gname,createdBY:req.user.name})
    const groupId = group.id;
    const userId = req.user.id;
    const isAdmin = true
    const userGroup = await UserGroup.findOne({where:{groupId: groupId,userId:userId}})
    userGroup.isAdmin = true;
    userGroup = await userGroup.save()
    return res.status(201).json({message:`${req.body.gname} is created with GroupID ${groupId}`,success:true})
  } 
  catch (error) 
  {
    return res.status(401).json({message:'something went wrorng',success:false,err:error})
  }
}

exports.getGroupsOfaUser = (req, res, next) => {
  req.user.getGroups().then((groups)=>{res.json(groups)})
}

exports.addUser = async (req, res, next) => {
  try 
  {
    let usrId;
    const pNumber = req.body.pNumber;
    const gid = req.body.gid;
    const user = await User.findOne({where:{pNumber: pNumber}})
    if(!user)
    {return res.status(403).json({message:'User does not exists!',success:false})}
    usrId = user.id;
    const group = await Group.findByPk(gid)
    if(!group)
    {return res.status(403).json({message:'Group does not exists!',success:false})}
    const adding = await UserGroup.create({isAdmin:false,groupId:gid,userId:usrId})
    return res.status(201).json({message:'User Added To The Group',success:true})
  } 
catch (error) 
  {
    return res.status(401).json({message:'Member is already in the group',success:false})
  }
}


exports.getGroupMessages = async (req, res, next) => {
  let latestId = await Message.max('id', { where: { groupId: req.params.gid } });
  let lastMessageId = req.params.lid;
  //console.log(lastMessageId)
  if(lastMessageId===undefined|| lastMessageId===null) lastMessageId=-1;
  //console.log(lastMessageId)
  Message.findAll({where: {groupId: req.params.gid,id: {[Op.gt]: lastMessageId}}, attributes:{exclude:['userId','createdAt','updatedAt']},include:{model:User, attributes:['name']}})
  .then(messages => {res.json({messages,lastMessageId:latestId})})
  .catch(err => {console.log(err);});
}

exports.postGroupMessage = async (req, res, next) => {
  const userGroup = await UserGroup.findOne({where:{groupId:req.params.gid,userId:req.user.id}})
  req.user.createMessage({message : req.body.message,groupId:req.params.gid,userGroupId : userGroup.id})
  .then(() => res.json({success:1}))
  .catch(err => {console.log(err);res.json({success:0})})
}



//NA means NewAdmin
//Super Powers of Admin
exports.MakeAsAdmin = async (req, res, next) => {
  const gid = req.body.gid;
  const NApNumber = req.body.NApNumber;
  const userGroup = await UserGroup.findOne({where:{groupId:gid,userId:req.user.id}})
  if(userGroup.isAdmin)
  {
    const NAUser = await User.findOne({where:{pNumber: NApNumber}})
    if(NAUser)
    {
      const NA = await UserGroup.findOne({where:{groupId:gid,userId:NAUser.id}})
      if(NA)
      {
        const makingAdmin = await NA.update({ isAdmin: true })
        NA.save().then(()=>{return res.json(1)})
      }
    }
  }
  
}

//RU means RemoveUser
exports.removeUser = async (req, res, next) => {
  const gid = req.body.gid;
  const RUpNumber = req.body.RUpNumber;
  console.log("came1")
  const userGroup = await UserGroup.findOne({where:{groupId:gid,userId:req.user.id}})
  if(userGroup.isAdmin)
  {
    const RUUser = await User.findOne({where:{pNumber: RUpNumber}})
    if(RUUser)
    {
      const RU = await UserGroup.findOne({where:{groupId:gid,userId:RUUser.id}})
      console.log("came2")
      RU.destroy().then(()=>res.json(1))
    }
  }
}