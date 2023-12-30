const usersCtrl = {};

const User = require('../models/User')
const passport = require('passport');


/////Tareas comunes para todos los usuarios///////////////////////////////////////

//Formulario para el ingreso a la plataforma 
usersCtrl.signInForm = (req, res)=>{
    if(req.user==undefined){
        res.render('users/signInForm') 
    }else{
        res.redirect('/users/started')
    }  
};
usersCtrl.signIn = passport.authenticate('local', {    
    successRedirect: "/users/started",
    failureRedirect: "/users/signInError",
    failureFlash: true
});
usersCtrl.signInError = (req, res)=>{
    req.flash('error_msg', 'El usuario o contraseña son incorrectos');
    res.redirect('signInForm')
};
usersCtrl.started = (req, res)=>{
    //console.log(req.user.role)
    var Admin = Empleado =  Cliente = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    if(req.user.role == 'Empleado'){
        Empleado = true;        
    }
    if(req.user.role == 'Cliente'){
        Cliente = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/started', {Admin, Empleado, Cliente, name, lastname, sec_lastname, rol    });
    //res.render('users/started', {name, lastname, sec_lastname}); 
};
/////////// Salida de la plataforma /////////////////////////
usersCtrl.logout = (req, res)=>{
    req.logout();
    req.flash("success_msg", "La sesión se cerró satisfactoriamente.");
    res.redirect("/");
};

//Crea un usuario de cualquier tipo.
usersCtrl.createUserForm = (req, res)=>{
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/createUserForm', {Admin, name, lastname, sec_lastname, rol});
    
};
usersCtrl.createUser = async (req, res)=>{
    //console.log(req.body)    revisar por si hay error
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const errors = [];
    const { identification_type, identification, name, lastname, sec_lastname, ///Información personal
    date_of_bird, gender, mobile_phone, role, email, password, confirm_password, ///Información de sesión
    company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
    legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number } = req.body;
       
    const userIdentification = await User.findOne({ identification: identification });
    const userEmail = await User.findOne({ email: email }); 
    
    ////Información personal
    if(identification_type === 'Elija un tipo de identificación') {
        errors.push({ text: 'Debe ingresar un tipo de identificación.' });
    }
    if (userIdentification) {
        errors.push({ text: 'Ya existe un usuario con esa identificación en la base de datos.' });
    }
    if (identification === '') {
        errors.push({ text: 'Debe ingresar un número de identificación.' });
    }
    if (name === '') {
        errors.push({ text: 'No ingresó el nombre.' });
    }
    if (lastname === '') {
        errors.push({ text: 'Debe ingresar al menos el primer apellido.' });
    }

    ///Información general
    if(date_of_bird === '') {
        errors.push({ text: 'Debe ingresar la fecha de nacimiento.'})
    }

    ////Información de sesión
    if (role === 'Elija un tipo de usuario') {
        errors.push({ text: 'No seleccionó un tipo de usuario.' });
    }
    if (email === '') {
        errors.push({ text: 'Debe ingresar un correo electrónico válido.' });
    }    
    if (userEmail) {
        errors.push({ text: 'Ya hay una cuenta registrada con el email ingresado.' });
    }    
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden.' });
    }
    if (password.length < 5) {
        errors.push({ text: 'Las contraseñas deben tener como mínimo 5 caracteres.' });
    }
    
    if (errors.length > 0) {
        res.render('users/createUserForm', { errors, Admin, identification_type, identification, name, lastname, sec_lastname,
            date_of_bird, gender, mobile_phone, role, email });
    }else {
        const data = { identification_type, identification, name, lastname, sec_lastname,
            date_of_bird, gender, mobile_phone, role, email, password,
            company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
            legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number };
        const newUser = new User(data);
        newUser.password = await newUser.encryptPassword(password);
        console.log(newUser)
        await newUser.save();
        req.flash('success_msg', 'Usuario creado satisfactoriamente.');
        res.redirect('started');
    }    
};

//Crea empresas.
usersCtrl.createCompanyForm = (req, res)=>{
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/createCompanyForm', {Admin, name, lastname, sec_lastname, rol});
    
};
usersCtrl.createCompany = async (req, res)=>{
    //console.log(req.body)    revisar por si hay error
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const errors = [];
    const { identification_type, identification, name, lastname, sec_lastname, ///Información personal
    date_of_bird, gender, mobile_phone, role, email, password, confirm_password, ///Información de sesión
    company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
    legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number } = req.body;
       
    const companyIdentification = await User.findOne({ nit: nit });
    const userIdentification = await User.findOne({ identification: identification });
    const userEmail = await User.findOne({ email: email }); 
    
    ////Información personal
    if(identification_type === 'Elija un tipo de identificación') {
        errors.push({ text: 'Debe ingresar un tipo de identificación.' });
    }
    if (userIdentification) {
        errors.push({ text: 'Ya existe un usuario con esa identificación en la base de datos.' });
    }
    if (companyIdentification) {
        errors.push({ text: 'Ya existe una empresa con ese NIT en la base de datos.' });
    }
    if (identification === '') {
        errors.push({ text: 'Debe ingresar un número de identificación.' });
    }
    if (name === '') {
        errors.push({ text: 'No ingresó el nombre.' });
    }
    if (lastname === '') {
        errors.push({ text: 'Debe ingresar al menos el primer apellido.' });
    }

    ///Información general
    if(date_of_bird === '') {
        errors.push({ text: 'Debe ingresar la fecha de nacimiento.'})
    }

    ////Información de sesión
    if (role === 'Elija un tipo de usuario') {
        errors.push({ text: 'No seleccionó un tipo de usuario.' });
    }
    if (email === '') {
        errors.push({ text: 'Debe ingresar un correo electrónico válido.' });
    }    
    if (company_name === '') {
        errors.push({ text: 'Debe ingresar el nombre de la empresa.' });
    }    
    if (nit === '') {
        errors.push({ text: 'Debe ingresar el NIT de la empresa.' });
    }    
    if (company_city === '') {
        errors.push({ text: 'Debe ingresar la ciudad en la que se ubica la empresa.' });
    }    
    if (company_department === '') {
        errors.push({ text: 'Debe ingresar el departamento en donde se ubica la empresa.' });
    }    
    if (company_address === '') {
        errors.push({ text: 'Debe ingresar la dirección de la empresa.' });
    }   
    if (company_phone === '') {
        errors.push({ text: 'Debe ingresar el numero de la empresa.' });
    }    
    if (legal_name === '') {
        errors.push({ text: 'Debe ingresar el nombre del representante legal de la empresa.' });
    }   
    if (legal_lastname === '') {
        errors.push({ text: 'Debe ingresar el apellido del representante legal de la empresa.' });
    }    
    if (legal_type_identification === '') {
        errors.push({ text: 'Debe ingresar el tipo de identificación del representante legal de la empresa.' });
    }    
    if (legal_number_identification === '') {
        errors.push({ text: 'Debe ingresar el numero de identificación del representante legal de la empresa.' });
    }    
    if (legal_mobile_number === '') {
        errors.push({ text: 'Debe ingresar el número de teléfono del representante legal de la empresa.' });
    }   
    if (userEmail) {
        errors.push({ text: 'Ya hay una cuenta registrada con el email ingresado.' });
    }    
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden.' });
    }
    if (password.length < 5) {
        errors.push({ text: 'Las contraseñas deben tener como mínimo 5 caracteres.' });
    }
    
    if (errors.length > 0) {
        res.render('users/createCompanyForm', { errors, identification_type, identification, name, lastname, sec_lastname,
            date_of_bird, gender, mobile_phone, role, email, company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
            legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number, Admin });
    }else {
        const data = { identification_type, identification, name, lastname, sec_lastname,
            date_of_bird, gender, mobile_phone, role, email, password,
            company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
            legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number };
        const newUser = new User(data);
        newUser.password = await newUser.encryptPassword(password);
        console.log(newUser)
        await newUser.save();
        req.flash('success_msg', 'Empresa creada satisfactoriamente.');
        res.redirect('started');
    }    
};

//////////////////////////////////////////////////////////////////////////////////
//Crear el primer administrador cuando se instala inicialmente la plataforma
//El primer usuario administrador se crea ingresando directamente la dirección http://localhost:3000/users/createAdminForm
//La idea es que esta dirección quede escondida para el público.
usersCtrl.createAdminForm = async (req, res)=>{  
    const user = await User.findOne({role: "Admin"});  
    if(!user){
        res.render('users/createAdminForm')  
    }else{
        req.flash('error_msg', 'Ya existe un usuario administrador.');
        res.redirect('/')
    }
    
};
usersCtrl.createAdmin = async (req, res)=>{
    console.log(req.body) 
    const errors = [];
    const { identification_type, identification, name, lastname, sec_lastname, ///Información personal
        date_of_bird, gender, mobile_phone, role, email, password, confirm_password, ///Información de sesión
        company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
        legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number } = req.body; ///Información de contacto
    
    const userIdentification = await User.findOne({ identification: identification });
    const userEmail = await User.findOne({ email: email }); 
    
    ////Información personal
    if(identification_type === 'Elija un tipo de identificación') {
        errors.push({ text: 'Debe ingresar un tipo de identificación.' });
    }
    if (userIdentification) {
        errors.push({ text: 'Ya existe esa identificación en la base de datos.' });
    }
    if (identification === '') {
        errors.push({ text: 'Debe digitar el número de identificación' });
    }
    if (name === '') {
        errors.push({ text: 'Debe ingresar el nombre.' });
    }
    if (lastname === '') {
        errors.push({ text: 'Debe ingresar al menos el primer apellido.' });
    }

    ///Información general
    if(date_of_bird === '') {
        errors.push({ text: 'Debe ingresar la fecha de nacimiento.'})
    }
    if(mobile_phone === ''){
        errors.push({ text: 'Debe ingresar un número de teléfono.'})
    }

    ////Información de sesión
    if (role === '--- Elija un tipo de usuario ---') {
        errors.push({ text: 'Debe ingresar un tipo de usuario.' });
    }
    if (email === '') {
        errors.push({ text: 'Debe ingresar un correo electrónico válido.' });
    }    
    if (userEmail) {
        errors.push({ text: 'El email del usuario ya existe en la base de datos.' });
    }    
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden.' });
    }
    if (password.length < 5) {
        errors.push({ text: 'Las contraseñas deben tener almenos 5 caracteres.' });
    }
     
    if (errors.length > 0) {
        res.render('users/createAdminForm', { errors, identification_type, identification, name, lastname, sec_lastname,
        date_of_bird, gender, mobile_phone, role, email});
    }else {
        const data = { identification_type, identification, name, lastname, sec_lastname,
            date_of_bird, gender, mobile_phone, role, email, password,
            company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
            legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number };
        const newUser = new User(data);
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Administrador creado satisfactoriamente.');
        res.redirect('/');
    }     
};

////Permite ver usuarios
usersCtrl.seeAllCustomers = async (req, res)=>{  
    const role = 'Cliente';    
    const pList = await User.find({role}).sort({name: 1});    
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/seeAllCustomers', {pList, Admin, name, lastname, sec_lastname, rol});    
};

usersCtrl.seeAllEmployees = async (req, res)=>{
    const role = 'Empleado';    
    const pList = await User.find({role}).sort({name: 1});    
    var Admin  = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/seeAllUsers', {pList, Admin, name, lastname, sec_lastname, rol});
};
usersCtrl.seeAllAdmin = async (req, res)=>{
    const role = 'Admin';    
    const pList = await User.find({role}).sort({name: 1});    
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/seeAllUsers', {pList, Admin, name, lastname, sec_lastname, rol});
};
usersCtrl.seeAllUsers = async (req, res)=>{       
    const ComName = 'LCA SYS'
    const pList = await User.find().sort({role: 1});    
    //const pList = await User.find({company_name:  "LCA SYS"}).sort({name: 1});    
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/seeAllUsers', {pList, Admin, name, lastname, sec_lastname, rol});
};
usersCtrl.findUserByIdentificationForm = (req, res)=>{
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/findUserByIdentification', {Admin, name, lastname, sec_lastname, rol});
}
usersCtrl.findUserByIdentification = async (req, res)=>{
    const { identification } = req.body;
    const pList = await User.find({identification});
    var Admin = Empleado = Medico = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    if(req.user.role == 'Empleado'){
        Empleado = true;        
    }
    if(req.user.role == 'Medico'){
        Medico = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/seeAllUsers', {pList, Admin, Empleado, Medico, name, lastname, sec_lastname, rol});        
}
//////Permite ver y Editar usuarios///////
usersCtrl.seeUserAdminForm = async (req, res) => {
    //console.log('Viendo un usuario')
    const user1 = await User.findById(req.params.id);
    //console.log(user1)
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/seeUserAdminForm', {user1, Admin, name, lastname, sec_lastname, rol}); 
}

usersCtrl.editUserFormAdmin = async (req, res) => {
    const user1 = await User.findById(req.params.id);
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/editUserAdminForm', {user1, Admin, name, lastname, sec_lastname, rol});      
};
usersCtrl.editUserAdmin = async (req, res) => {  
    //console.log(req.body)
    const {identification_type, identification, name, lastname, sec_lastname,
        date_of_bird, gender, mobile_phone, role, email, password,
        company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
        legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number } = req.body
        
                await User.findByIdAndUpdate(req.params.id, {identification_type, identification, name, lastname, sec_lastname,
                    date_of_bird, gender, mobile_phone, role, email, password,
                    company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
                    legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number })  
                const admin = true
                req.flash('success_msg', 'Datos editados satisfactoriamente.');
                res.redirect('/users/seeAllUsers')
}; 

usersCtrl.seeCompanyAdminForm = async (req, res) => {
    //console.log('Viendo un usuario')
    const user1 = await User.findById(req.params.id);
    //console.log(user1)
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/seeCompanyAdminForm', {user1, Admin, name, lastname, sec_lastname, rol}); 
}

usersCtrl.editCompanyFormAdmin = async (req, res) => {
    const user1 = await User.findById(req.params.id);
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('users/editCompanyAdminForm', {user1, Admin, name, lastname, sec_lastname, rol});      
};
usersCtrl.editCompanyAdmin = async (req, res) => {  
    //console.log(req.body)
    const {identification_type, identification, name, lastname, sec_lastname,
        date_of_bird, gender, mobile_phone, role, email, password,
        company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
        legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number } = req.body
        
                await User.findByIdAndUpdate(req.params.id, {identification_type, identification, name, lastname, sec_lastname,
                    date_of_bird, gender, mobile_phone, role, email, password,
                    company_name, nit, company_city, company_department, company_address, company_phone, legal_name, 
                    legal_lastname, legal_sec_lastname, legal_type_identification, legal_number_identification, legal_mobile_number })  
                const admin = true
                req.flash('success_msg', 'Datos editados satisfactoriamente.');
                res.redirect('/users/seeAllCustomers')
}; 

//////Permite borrar usuarios///////
usersCtrl.deletUserAdmin = async (req, res) => {    
    await User.findByIdAndDelete(req.params.id);    
    req.flash('success_msg', 'Usuario eliminado satisfactoriamente.');
    res.redirect('/users/seeAllUsers')
};

usersCtrl.myProfile = (req, res)=>{
    //const { name, lastname, sec_lastname, identification, email } = req.user;
    //console.log(req.user)
    const user = req.user;
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    if(req.user.role == 'Admin'){
        const Admin = true;
        res.render('users/myProfile', {Admin, user, name, lastname, sec_lastname, rol});
    }else if (req.user.role == 'Cliente'){
        const Cliente = true;
        res.render('users/myProfile', {Cliente, user, name, lastname, sec_lastname, rol});
    }else if (req.user.role == 'Empleado'){
        const Empleado = true;
        res.render('users/myProfile', {Empleado, user, name, lastname, sec_lastname, rol});
    }
    //res.render('users/myProfile')
}

////Cambiara la contraseña///
usersCtrl.changePasswdForm = (req, res)=>{
    const user = req.user;
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    if(req.user.role == 'Admin'){
        const Admin = true
        res.render('users/changePasswd', { user, Admin, name, lastname, sec_lastname, rol});
    } else if(req.user.role == 'Empleado'){
        const Empleado = true
        res.render('users/changePasswd', { user, Empleado,name, lastname, sec_lastname, rol});
    } else if(req.user.role == 'Cliente'){
        const Cliente = true
        res.render('users/changePasswd', { user, Cliente, lastname, sec_lastname, rol});
    }

} 
usersCtrl.changePasswd = async (req, res)=>{
    const errors = [];
    const { actual_password, new_password, confirm_new_password } = req.body
    
    const match = await req.user.matchPassword(actual_password);
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    if(!match){
        //console.log('No digitaste bien tu contraseña actual!!!')
        errors.push({ text: 'Error al digitar la contraseña actual.'}); 
    } 
    if ( new_password != confirm_new_password) {
        errors.push({ text: 'No coinciden las contraseñas.' });
    }
    if (new_password.length < 5) {
        errors.push({ text: 'La nueva contraseña debe tener almenos 5 caracteres.'});
    }

    if (errors.length > 0) {
        if(req.user.role == 'Admin'){
            const Admin = true;
            res.render('users/changePasswd', {errors, Admin, name, lastname, sec_lastname, rol});
        }else if (req.user.role == 'Cliente'){
            const Cliente = true;
            res.render('users/changePasswd', {errors, Cliente, name, lastname, sec_lastname, rol});
        }else if (req.user.role == 'Empleado'){
            const Empleado = true;
            res.render('users/changePasswd', {errors, Empleado, name, lastname, sec_lastname, rol});
        }             
    } else {
        password = await req.user.encryptPassword(new_password);        
        //console.log(password);
        const id = req.user._id;
        await User.findByIdAndUpdate(id, { password });
        req.flash('success_msg', 'Contraseña actualizada satisfactoriamente.');
        res.redirect('/users/started')         
    }
};
///Cuando se olvida la contraseña
usersCtrl.forgotPasswordForm = (req, res)=>{
    if(req.user == undefined){
        res.render('users/forgotPasswordForm')
    }else{
        res.redirect('/users/started')
    }
}
usersCtrl.forgotPassword = async (req, res)=>{
    const { email } = req.body;
    const user = await User.findOne({email});    

    if(user != null){
        //console.log(user);
        const {name, lastname, sec_lastname} = user;
        var passwd = '';
        var characters = 'ABCDEFGHIJ#KLM!NO$PQR%ST&UVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 10; i++ ) {
           passwd += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        //console.log(passwd)

        password = await user.encryptPassword(passwd); 
        const id = user._id;
        await User.findByIdAndUpdate(id, { password });
        const message = "Su contraseña ha sido cambiada correctamente."

        contentHTML = `
        <h1>PAV - Sistema de Información</h1>
        <h4>Sistema hospitalario del Huila</h4>
        <ul>
            <li>Usuario: ${name } ${lastname } ${sec_lastname }</li>
            <li>Email: ${email}</li>
            <li>Nueva contraseña: ${passwd}</li>             
        </ul>
        <p>${message}</p> `;

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'gtst@usco.edu.co',  
                pass: 'pnckgyqntqlzjzagfffffff'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    
        let info = await transporter.sendMail({
            from: '"Plataforma PAV - Sistema de información - GTST-Usco" <gtst@usco.edu.co>', // sender address,
            to: email,                               //A esta dirección sera enviado el correo
            subject: 'Recuperación de contraseña',
            // text: 'Hello World'
            html: contentHTML
        })


    } 
    req.flash('success_msg', 'Se ha enviado la nueva contraseña al correo del usuario.');
    res.redirect('/users/signInForm')
}


module.exports = usersCtrl;