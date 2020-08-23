
exports.getLogin=(req,res,next)=>{
    console.log(req.session.isLoggedin);
    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
        isAuthenticated:false
    })
};

exports.postLogin=(req,res,next)=>{
    req.session.isLoggedin=true,
    isAuthenticated=true,
    res.redirect('/')
};