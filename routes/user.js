var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')

// get request for user home page
router.get('/', function(req, res, next) {

  let user = req.session.user;

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
  res.render('index', {products,user,  admin:false});
});


// get request for user login
router.get('/login', function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect('/')
  }else {
    res.render('user/user-login',{ "loginErr":req.session.loginErr ,admin:false })
    req.session.loginErr = false;
  }
  
});

// get request for user signup
router.get('/signup', function(req, res, next) {
  res.render('user/user-signup',{admin:false})
});

// post request for user signup

router.post('/signup', (req,res) => {
  userHelpers.doUserSignup(req.body).then((response) => {
    console.log(response);
    res.redirect('/',)
  })
})

// post request for user login

router.post('/login', (req,res)=>{
  userHelpers.doUserLOgin(req.body).then((response) => {
    if(response.status){
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr="Invalid username or password!!";
      res.redirect('/login')
    }
    
  })
})

// get request for user logout

router.get('/logout', (req,res)=> {
  req.session.destroy();
  res.redirect('/')
})

module.exports = router;
