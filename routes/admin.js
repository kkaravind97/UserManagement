var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers')
var userHelpers = require('../helpers/user-helpers')
var objectId = require('mongodb').ObjectId;


// get request for admin home page
router.get('/', function(req, res, next) {
  let adminUser = req.session.adminUser
  console.log(adminUser);
let products = [
  {
    name:"T-shirt",
    category:"Mens wear",
    description:"Comfortable",
    image:"/images/1.jpg",
    price:"669/-"
  },
  {
    name:"Jacket",
    category:"Rain Jacket",
    description:"Comfortable",
    image:"/images/2.jpg",
    price:"1050/-"
  },
  {
    name:"Shorts",
    category:"Mens wear",
    description:"Comfortable",
    image:"/images/3.jpg",
    price:"990/-"
  },
  {
    name:"Handbag",
    category:"Ladies Bag",
    description:"Comfortable",
    image:"/images/4.jpg",
    price:"2130/-"
  },
  {
    name:"Wallet",
    category:"Mens",
    description:"Cheap",
    image:"/images/5.jpg",
    price:"780/-"
  },
  {
    name:"Sofa",
    category:"Domestic item",
    description:"Relaxation",
    image:"/images/6.jpg",
    price:"7550/-"
  },
  {
    name:"Watch",
    category:"Smart Watch",
    description:"Timefull",
    image:"/images/7.jpg",
    price:"3550/-"
  },
  {
    name:"Air pod",
    category:"Headset",
    description:"Enjoy",
    image:"/images/8.jpg",
    price:"2450/-"
  },
]
res.render('admin/view-products', {products,adminUser, admin:true});
});


// get request for admin login

router.get('/login', function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect('/admin')
  }else{
    res.render('admin/login',{admin:true, "loginErr":req.session.loginErr})
    req.session.longinErr=false;
  }
  
});

//get request for admin signup
 
router.get('/signup', function(req, res, next) {
  res.render('admin/signup',{admin:true})
});

// post request for admin signup

router.post('/signup', (req,res)=>{
  adminHelpers.doSignUp(req.body).then((response)=>{
    console.log(response);
    res.redirect('/admin',);
  })
})

// post request for admin login

router.post('/login',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn = true
      req.session.adminUser = response.adminUser
      res.redirect('/admin')
    }else{
      req.session.loginErr="Invalid username or password!!";
      res.redirect('/admin/login')
    }
  })
})

// request for admin logout

router.get('/logout', (req,res)=>{
  req.session.destroy();
  res.redirect('/admin/login')
})

// get request for all users list

router.get('/all-users', (req,res)=>{
  let adminUser = req.session.adminUser;
  userHelpers.getAllUsers().then((usersData) => {
    res.render('admin/all-users',{admin:true, adminUser,usersData})
  })
  
})

// get request for edit-users page

router.get('/edit-user/:id', async (req,res)=>{
  let adminUser = req.session.adminUser;
  let userDetails = await userHelpers.getUsersData(req.params.id)
  console.log(userDetails);
  res.render('admin/edit-user', {admin:true, adminUser, userDetails})
})


// post request for edit-users page

router.post('/edit-user/:id', (req,res) => {
  console.log(req.params.id);
  let id = req.params.id;
  userHelpers.updateUserDetails(req.params.id, req.body).then(() => {
    res.redirect('/admin')
  })
})

// get request for user delete

router.get('/delete-user/:id', (req,res) => {
  let userId=req.params.id;
  console.log(userId);
  userHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin/all-users')
  })
})

module.exports = router;
