var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//接受前端传回的数据
const bodyParser=require('body-parser');
//请求后端接口
const request=require('request');
const querystring=require('querystring');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
   
// parse application/json
app.use(bodyParser.json())


//跨域  后期删
app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8080"); //为了跨域保持session，所以指定地址，不能用*
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true); 
    next();
});


app.post('/sms_send',(req,res)=>{
	const code=000000+Math.floor(Math.random()*999999);
//	console.log(req.body.phone);
	var queryData = querystring.stringify({
	    "mobile": req.body.phone,  // 接受短信的用户手机号码
	    "tpl_id": req.body.tpl_id,  // 您申请的短信模板ID，根据实际情况修改
	    "tpl_value": `#code#=${code}`,  // 您设置的模板变量，根据实际情况修改
	    "key":req.body.key,  // 应用APPKEY(应用详细页查询)
	});
	
	var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
	
	request(queryUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body) // 打印接口返回内容
			
			var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
			console.log(jsonObj)
			res.json(jsonObj);
		} else {
			console.log('请求异常');
		}
	}) 
})





//session
var session=require('express-session');
app.use(session({
    secret:'classweb531234',               //设置 session 签名
    name:'classweb',
    cookie:{maxAge:60*1000*60*24}, // 储存的时间 24小时
    resave:false,             // 每次请求都重新设置session
    saveUninitialized:true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;




