const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const path = require('path');
// 0rJJNc6iHqh7d4n9
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes=require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next)=>{
    User.findById("5f402cbf13170d126ce03a7b")
    .then(user=>{
        req.user=user,
        next();
    })
    .catch(err=>{
        console.log(err);
    })
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
const User=require('./models/user')

mongoose.connect('mongodb+srv://rishabh:0rJJNc6iHqh7d4n9@cluster0.4ynev.mongodb.net/shop?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
        const user=new User({
        name:"Rishabh",
        email:"abc@test.com",
        cart:{
            items:[]
        }
        });
           user.save()
        }
    })

    app.listen(3000,()=>{
        console.log("Connected succesfully")
    })
})
.catch(error=>{
    console.log(error);
})

