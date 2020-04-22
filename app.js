var express      = require("express"),
	app          = express(),
	mongoose   	 = require("mongoose"),
	passport     = require("passport"),
	LocalStrategy= require("passport-local"),
	bodyParser   = require("body-parser"),
	User         = require("./models/user");

mongoose.connect("mongodb://localhost/app");

app.use(require("express-session")({
		secret : "Rusty",
		resave : false,
		saveUninitialized : false
		}));

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize())
app.use(passport.session()); 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
res.render("home");
});

app.get("/secret",isLoggenIn, function(req,res){
res.render("secret");
});


////REGISTER
app.get("/register",function(req,res){
res.render("register");
});


app.post("/register",function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function()
			{
    			res.redirect("/secret");
			});
	});
});


/////LOGIN

app.get("/login",function(req,res){
res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login" }),function(req,res){
});


//////  Logout
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

function isLoggenIn(req,res,next)
{
	if(req.isAuthenticated()){
		return next();
}	
	res.redirect("/login");
}


app.listen(3000,function(){
console.log("SERVER");
});

