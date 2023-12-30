const requestCtrl = {};

const Request = require('../models/Request')
const User = require('../models/User')
const passport = require('passport');


requestCtrl.createRequestForm = async (req, res)=>{       
    
    const fullRequest = await Request.aggregate([{$match: {state: "creado"}},{ $group: {_id: "$date_of_maintenance", count: { $sum: 1} } }, { $match: {count: {"$gte": 8}}}]);//para desactivar el dia
    console.log(fullRequest)
    const fechasFull = [];
    const fechasCorrect = [];
    for (i=0; i<fullRequest.length; i++){
        fechasFull.push(Date.parse(fullRequest[i]._id));
    }
    for (i=0; i<fechasFull.length; i++){
        fechasCorrect.push(new Date(fechasFull[i]).toLocaleDateString());
    }
    const date = new Date();
    const currentDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' +String(date.getDate()).padStart(2, '0');
    console.log(fechasFull)
    console.log(fechasCorrect)
    //const pList = await Exams.find({$and: [{date_of_exam : null}, {hour_of_exam : null}, {state_of_exam: "activo"}]}).sort({date_of_exam: 1});
    //const pList = await Exams.find();
    var Cliente = null;
    if(req.user.role == 'Cliente'){
        Cliente = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    const company_name = req.user.company_name;
    const company_address = req.user.company_address;
    const company_city = req.user.company_city;
    const company_phone = req.user.company_phone;
    const company_rel = req.user._id;
    res.render('request/createRequestForm', {fechasCorrect, Cliente, name, lastname, sec_lastname, rol, company_name, currentDate, company_address, company_city, company_phone, company_rel});
};

requestCtrl.obtainDate = async (req, res)=>{
    const { date } = req.body;
    console.log(date)
    const date2 = date.replace('/', '-');
    const date3 = date2.replace('/', '-');
    console.log(date3)

    const dateNow = new Date();
    const currentDate = dateNow.getFullYear() + '-' + String(dateNow.getMonth() + 1).padStart(2, '0') + '-' +String(dateNow.getDate()).padStart(2, '0');
    
    const request = await Request.find({$and: [{date_of_maintenance: date3}, {state: "creado"}]});
    console.log(request)
    const hours = [];
    for (i=0; i<request.length; i++){
        hours.push(String(request[i].hour_of_maintenance));
    }
    console.log(hours)
    var Cliente = null;
    if(req.user.role == 'Cliente'){
        Cliente = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    const company_city = req.user.company_city;
    const company_name = req.user.company_name;
    const company_address = req.user.company_address;
    const company_phone = req.user.company_phone;
    const company_rel = req.user._id;
    res.render('request/createRequestFormHour', {date3, hours, currentDate, Cliente, name, lastname, sec_lastname, rol, company_city, company_name, company_address, company_phone, company_rel});
};

requestCtrl.createRequest = async (req, res)=>{
    //console.log(req.body)    //revisar por si hay error    
    var Cliente = null;
    if(req.user.role == 'Cliente'){
        Cliente = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;

    const errors = []; 

    const {date_of_request, company_request, company_request_ad, company_request_city, company_request_pho, request_by,
         date_of_maintenance, hour_of_maintenance, description, state, company_rel} = req.body;

     if(date_of_maintenance === '') {
        errors.push({ text: 'Debe ingresar la fecha de examen.'})
    }

    if(hour_of_maintenance === '--- Seleccione una hora ---') {
        errors.push({ text: 'Debe ingresar la hora de examen.'})
    }

    if(description === '') {
        errors.push({ text: 'Debe ingresar la descripción del problema.'})
    }

    if (errors.length > 0) {
        res.render('users/started', { errors, Cliente, name, lastname, sec_lastname, rol, date_of_maintenance});
    }else {
        const data = {date_of_request, company_request, company_request_ad, company_request_city, company_request_pho, request_by,
            date_of_maintenance, hour_of_maintenance, description, state, company_rel};
        const newRequest = new Request(data);
        console.log(newRequest)
        await newRequest.save();
        req.flash('success_msg', 'Agendamiento creado satisfactoriamente.');
        //res.redirect('/exams/createRequestForm');
        res.redirect('/users/started');
    }     

};

requestCtrl.seeAllCreateRequest = async (req, res)=>{       
    const empleados = await User.find({ role: "Empleado"});
    console.log(empleados)
    const pList = await Request.find({$and: [{employee_rel : null}, {state: "creado"}]}).sort({date_of_maintenance: 1});
    //const pList = await Exams.find();
    var Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;
    res.render('request/seeAllCreateRequest', {pList, empleados, Admin, name, lastname, sec_lastname, rol});
};

requestCtrl.assignTo = async (req, res)=>{
    /* const { identification } = req.body;
    const pList = await User.find({identification}); */
    var  Admin = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;

    const errors = []; 

    const { employee_rel, state, employee_fullname } = req.body;
    if(employee_rel === 'Elija un empleado') {
        errors.push({ text: 'Debe seleccionar un empleado.'})
    }
    if (errors.length > 0) {
        req.flash('error_msg', 'Debe seleccionar un empleado.');
        res.redirect('/request/seeAllCreateRequest')
    }else {
        await Request.findByIdAndUpdate(req.params.id, {employee_rel, state, employee_fullname})  
        const admin = true
        req.flash('success_msg', 'Mantenimiento asignado satisfactoriamente.');
        res.redirect('/users/started')
    }
    
};

requestCtrl.finished = async (req, res)=>{
    /* const { identification } = req.body;
    const pList = await User.find({identification}); */
    var  Empleado = null;
    if(req.user.role == 'Empleado'){
        Empleado = true;        
    }
    const name = req.user.name;
    const lastname = req.user.lastname;
    const sec_lastname = req.user.sec_lastname;
    const rol = req.user.role;

    const errors = []; 

    const { notes, state } = req.body;
    if(notes === '') {
        errors.push({ text: 'Debe agregar el resumen del mantenimiento.'})
    }
    if (errors.length > 0) {
        req.flash('error_msg', 'Debe agregar el resumen del mantenimiento.');
        res.redirect('/request/pendingRequest')
    }else {
        await Request.findByIdAndUpdate(req.params.id, {notes, state})  
        const Empleado = true
        req.flash('success_msg', 'Mantenimiento finalizado satisfactoriamente.');
        res.redirect('/users/started')
    }
    
};

requestCtrl.pendingRequest = async (req, res)=>{       
    var Admin = Empleado = Cliente = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
        const pList = await Request.find({state : "asignado"}).sort({date_of_maintenance: 1});
        const name = req.user.name;
        const lastname = req.user.lastname;
        const sec_lastname = req.user.sec_lastname;
        const rol = req.user.role;
        res.render('request/pendingRequest', {pList, Admin, Empleado, Cliente, name, lastname, sec_lastname, rol});
    }
    if(req.user.role == 'Empleado'){
        Empleado = true;        
        const pList = await Request.find({$and: [{employee_rel : req.user.id}, {state : "asignado"}]}).sort({date_of_maintenance: 1});
        const name = req.user.name;
        const lastname = req.user.lastname;
        const sec_lastname = req.user.sec_lastname;
        const rol = req.user.role;
        res.render('request/pendingRequest', {pList, Admin, Empleado, Cliente, name, lastname, sec_lastname, rol});
    }
    if(req.user.role == 'Cliente'){
        Cliente = true;        
        const pList = await Request.find ({$and: [{$or: [{state: "asignado"}, {state: "creado"}]},{company_rel : req.user.id}]}).sort({date_of_maintenance: 1});
        const name = req.user.name;
        const lastname = req.user.lastname;
        const sec_lastname = req.user.sec_lastname;
        const rol = req.user.role;
        res.render('request/pendingRequest', {pList, Admin, Empleado, Cliente, name, lastname, sec_lastname, rol});
    }
};

requestCtrl.finishedRequest = async (req, res)=>{       
    var Admin = Empleado = Cliente = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
        const pList = await Request.find({state : "finalizado"}).sort({date_of_maintenance: 1});
        const name = req.user.name;
        const lastname = req.user.lastname;
        const sec_lastname = req.user.sec_lastname;
        const rol = req.user.role;
        res.render('request/finishedRequest', {pList, Admin, Empleado, Cliente, name, lastname, sec_lastname, rol});
    }
    if(req.user.role == 'Empleado'){
        Empleado = true;        
        const pList = await Request.find({$and: [{employee_rel : req.user.id}, {state : "finalizado"}]}).sort({date_of_maintenance: 1});
        const name = req.user.name;
        const lastname = req.user.lastname;
        const sec_lastname = req.user.sec_lastname;
        const rol = req.user.role;
        res.render('request/finishedRequest', {pList, Admin, Empleado, Cliente, name, lastname, sec_lastname, rol});
    }
    if(req.user.role == 'Cliente'){
        Cliente = true;        
        const pList = await Request.find ({$and: [{state: "finalizado"},{company_rel : req.user.id}]}).sort({date_of_maintenance: 1});
        const name = req.user.name;
        const lastname = req.user.lastname;
        const sec_lastname = req.user.sec_lastname;
        const rol = req.user.role;
        res.render('request/finishedRequest', {pList, Admin, Empleado, Cliente, name, lastname, sec_lastname, rol});
    }
};

requestCtrl.declineRequest = async (req, res)=>{       
    var Admin = Cliente = null;
    if(req.user.role == 'Admin'){
        Admin = true;        
        const pList = await Request.find({state : "rechazado"}).sort({date_of_maintenance: 1});
        const name = req.user.name;
        const lastname = req.user.lastname;
        const sec_lastname = req.user.sec_lastname;
        const rol = req.user.role;
        res.render('request/declineRequest', {pList, Admin, Cliente, name, lastname, sec_lastname, rol});
    }
    if(req.user.role == 'Cliente'){
        Cliente = true;        
        const pList = await Request.find ({$and: [{state: "rechazado"},{company_rel : req.user.id}]}).sort({date_of_maintenance: 1});
        const name = req.user.name;
        const lastname = req.user.lastname;
        const sec_lastname = req.user.sec_lastname;
        const rol = req.user.role;
        res.render('request/declineRequest', {pList, Admin, Cliente, name, lastname, sec_lastname, rol});
    }
};

requestCtrl.cancelRequest = async (req, res) => {  
    //console.log(req.body)
    const {state} = req.body
        
                await Request.findByIdAndUpdate(req.params.id, {state})  
                const admin = true
                req.flash('success_msg', 'Mantenimiento rechazado satisfactoriamente.');
                res.redirect('/users/started')
}; 


//////Permite borrar examenes///////
requestCtrl.deleteExam = async (req, res) => {    
    await Exams.findByIdAndDelete(req.params.id);  
    req.flash('success_msg', 'Registro de examen eliminado satisfactoriamente.');  
    res.redirect('/users/started')
};

module.exports = requestCtrl;