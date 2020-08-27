const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const path = require('path');
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf=require('csurf')
const flash=require('connect-flash')

const errorController = require('./controllers/error');
const app = express();
const MONGO_URI='mongodb+srv://rishabh:0rJJNc6iHqh7d4n9@cluster0.4ynev.mongodb.net/shop?retryWrites=true&w=majority';

app.set('view engine', 'ejs');

const store=new MongoDBStore({
    uri:MONGO_URI,
    collection:'sessions'
})
const csrfProtection=csrf();    // genereating middleware

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes=require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
 secret: 'This is a secret',
  resave: false,
  saveUninitialized: false,
  store:store
}))
app.use(csrfProtection)    //Added csrf token as middleware
app.use(flash())
app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

  app.use((req,res,next)=>{
    res.locals.isAuthenticated= req.session.isLoggedIn,
    res.locals.csrfToken=req.csrfToken(),      //Token generator
    next()
  })


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
const User=require('./models/user')

mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(result=>{ 
    app.listen(3000,()=>{
        console.log("Connected succesfully")
    })
})
.catch(error=>{
    console.log(error);
})

