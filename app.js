const path = require('path');
// 0rJJNc6iHqh7d4n9
const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://rishabh:0rJJNc6iHqh7d4n9@cluster0.4ynev.mongodb.net/shop?retryWrites=true&w=majority',{
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

