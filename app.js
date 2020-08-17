const express=require('express')
const app=express()
const bodyparser=require('body-parser');

const PORT=3000;
app.use(bodyparser.urlencoded({extended:false}))


app.use('/admin',require('./routes/admin'))
app.use(require('./routes/shop'))

app.use((req,res)=>{
    res.status(404).send('<h1> Page not found </h1>')
})

app.listen(PORT,()=>{
    console.log(`Connected to ${PORT}`);
})