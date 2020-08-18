const express=require('express')
const app=express()
const bodyparser=require('body-parser');
const path=require('path')

const PORT=3000;

app.use(bodyparser.urlencoded({extended:false}))

app.use(require('./routes/shop'))
app.use('/admin',require('./routes/admin'))

app.use(express.static(path.join(__dirname,'public')))

app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'views','error.html'))
})

app.listen(PORT,()=>{
    console.log(`Connected to ${PORT}`);
})