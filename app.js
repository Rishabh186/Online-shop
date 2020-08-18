const express=require('express')
const app=express()
const bodyparser=require('body-parser');
const path=require('path')
const adminData=require('./routes/admin')

const PORT=3000;

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

app.set('view engine','ejs');

app.use(require('./routes/shop'))
app.use('/admin',adminData.routes)

app.use((req, res, next) => {
    res.status(404).render('error', { pageTitle: 'Page Not Found' });
});
  
app.listen(PORT,()=>{
    console.log(`Connected to ${PORT}`);
})