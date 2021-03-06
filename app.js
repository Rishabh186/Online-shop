const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const path = require('path');
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf=require('csurf')
const flash=require('connect-flash')
const multer=require('multer')
const helmet=require('helmet')
const compression =require('compression')
const morgan=require('morgan')

const app = express();
app.use(helmet());
app.use(compression());
// app.use(morgan('combined'));

const errorController = require('./controllers/error');

const MONGO_URI=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.4ynev.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

app.set('view engine', 'ejs');

const store=new MongoDBStore({
    uri:MONGO_URI,
    collection:'sessions'
})
const csrfProtection=csrf();    // genereating middleware

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes=require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

app.use(session({
 secret: 'This is a secret',
  resave: false,
  saveUninitialized: false,
  store:store
}))
app.use(csrfProtection)    //Added csrf token as middleware

app.use((req,res,next)=>{
  res.locals.isAuthenticated= req.session.isLoggedIn,
  res.locals.csrfToken=req.csrfToken(),      //Token generator
  next()
})

app.use(flash())
app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        // throw new Error("Dummy")   //Inside synchronous code error is thrown like this
        if(!user){
          next();
      }
        req.user = user;
        next();
      })
      .catch(err=>{
        next(new Error(err));   //Inside the aynchronous code error is thrown like this
        });
  });

 


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500',errorController.get500);
app.use(errorController.get404);

app.use((error,req,res,next)=>{
  res.status(500).render('500', {
    pageTitle: 'Error occured',
    path: '/500',
    isAuthenticated:req.session.isLoggedIn
})
})

const User=require('./models/user')

mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(result=>{ 
    app.listen(process.env.PORT||3000,()=>{
        console.log("Connected succesfully")
    })
})
.catch(error=>{
    console.log(error);
})

