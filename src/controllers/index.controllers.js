const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
    if(req.user == undefined){
        res.render('index')
    }else{
        res.redirect('users/started')
        //res.render('index', {user: false})
    }       
}; 


module.exports = indexCtrl; 