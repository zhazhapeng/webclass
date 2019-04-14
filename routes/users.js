var express = require('express');
var router = express.Router();
var handler = require('./dbhandler.js');
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;

const url = require('url');

//var Idea=require('../models/Idea.js');
/* POST users listing. */
//登录
router.post('/login', function(req, res, next) {

//  直接对比
	var password=req.body.password;
	var username=req.body.username;
	//进行加密对比
	var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('base64');
	handler(req,res,"user",{name:username},function(data){
		if(data.length===0){
			res.end('{"err":"抱歉，系统中并无该用户，如有需要，请向管理员申请"}');
		}else if(data[0].password !== password){
            res.end('{"err":"密码不正确"}');
        }else if(data.length!==0&&data[0].password===password){
            
            req.session.username = req.body.username; //存session
            req.session.password = password;
            
            res.end('{"success":"true"}');
        }
	})
});

//删除博客
router.get('/delete', function(req, res, next) {
	let params = url.parse(req.url, true).query;//解析数据 获得Json对象
	var id = params.id;//通过参数名称获得参数值
		console.log(id);
		handler(req,res,"blog",{_id:ObjectId(id)},function(data){
			 res.end('{"success":"true"}');
		})
})

//博客总览
router.get('/showCourse', function(req, res, next) {
//	var title="大鹏数据库";
	handler(req,res,"blog",function(data){
		res.send(data);
	})
})


//编辑获得唯一id
router.get('/show', function(req, res, next) {
	let params = url.parse(req.url, true).query;//解析数据 获得Json对象
	var id = params.id;//通过参数名称获得参数值
//console.log(id);
	var _id=id;
	handler(req,res,"blog",{_id:ObjectId(_id)},function(data){
//		console.log(data);
		res.send(data);
	})
})

//修改博客内容
router.post('/update',function(req,res,next){
	console.log(req.body);
//	console.log(req.params);
	
	var id = req.body.id;//通过参数名称获得参数值
	
	var title=req.body.title;
	var body=req.body.body;
	var author=req.body.author;
	var type=req.body.type;
	handler(req,res,"blog",[{_id:ObjectId(id)},{_id:ObjectId(id),title:title,body:body,author:author,type:type}],function(data){
//		console.log(data);
		res.end('{"success":"true"}');
	})
})



router.post('/register', function(req, res, next) {
	var password=req.body.password;
	var username=req.body.username;
	var email=req.body.email;
	var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('base64');
	handler(req,res,"user",{name:username,password:password,email:email},function(data){
	
		res.end('{"success":"true"}');

	})
});

router.post('/blog', function(req, res, next) {
	var title=req.body.title;
	var body=req.body.body;
	var author=req.body.author;
	var type=req.body.type;
	handler(req,res,"blog",{title:title,body:body,author:author,type:type},function(data){
	
		res.end('{"success":"true"}');

	})
});




module.exports = router;