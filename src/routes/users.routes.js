const {Router} = require('express')
const router =Router();

const {isAuthenticated, isAdmin} = require('../helpers/auth');

const {createAdminForm, createAdmin, createUserForm, createUser, signInForm, signIn, seeAllUsers, createCompanyForm,
        started, logout, changePasswdForm, changePasswd, signInError, seeAllCustomers, createCompany, seeCompanyAdminForm,
        findUserByIdentificationForm, findUserByIdentification, editUserFormAdmin, editCompanyFormAdmin, editCompanyAdmin,
        editUserAdmin, seeUserAdminForm, deletUserAdmin, forgotPasswordForm, forgotPassword, myProfile} = require('../controllers/users.controllers')

/////Tareas comunes para todos los usuarios///////////////////////////////////////

///Formulario para el ingreso a la plataforma
router.get('/users/signInForm', signInForm);
router.post('/users/signIn', signIn);
router.get('/users/signInError', signInError);
router.get('/users/started', isAuthenticated, started);  

/////////// Salida de la plataforma /////////////////////////
router.get('/users/logout', logout);

router.get('/users/createUserForm',  isAuthenticated, isAdmin, createUserForm);
router.post('/users/createUser', isAuthenticated, isAdmin, createUser);

router.get('/users/createCompanyForm',  isAuthenticated, isAdmin, createCompanyForm);
router.post('/users/createCompany', isAuthenticated, isAdmin, createCompany);

//Crear el primer administrador de la plataforma cuando se instala inicialmente 
router.get('/users/createAdminForm', createAdminForm);
router.post('/users/createAdmin', createAdmin);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//router.get('/users/seeAllCompanies', isAuthenticated, isAdmin, seeAllCompanies);
router.get('/users/seeAllCustomers', isAuthenticated, isAdmin, seeAllCustomers);
router.get('/users/seeAllUsers', isAuthenticated, isAdmin, seeAllUsers);

router.get('/users/findUserByIdentification', isAuthenticated, isAdmin, findUserByIdentificationForm);
router.post('/users/findUserByIdentification', isAuthenticated, isAdmin, findUserByIdentification);

//router.get('/users/findUserByEmail', isAuthenticated, isAdminEmpleMedi, findUserByEmailForm);
//router.post('/users/findUserByEmail', isAuthenticated, isAdminEmpleMedi, findUserByEmail);

////Permite ver y editar los usuarios///////////////////////////////////////////////
router.get('/users/seeUserAdminForm/:id', isAuthenticated, isAdmin, seeUserAdminForm)
router.get('/users/seeCompanyAdminForm/:id', isAuthenticated, isAdmin, seeCompanyAdminForm)

router.get('/users/editUserFormAdmin/:id', isAuthenticated, isAdmin, editUserFormAdmin);///Formulario para editar usuarios
router.put('/users/editUserAdmin/:id', isAuthenticated, isAdmin, editUserAdmin);/////actualiza usuario

router.get('/users/editCompanyFormAdmin/:id', isAuthenticated, isAdmin, editCompanyFormAdmin);///Formulario para editar empresas
router.put('/users/editCompanyAdmin/:id', isAuthenticated, isAdmin, editCompanyAdmin);/////actualiza empresa

//////////////Borrar usuarios //////////////////////////////
router.delete('/users/deleteUserAdmin/:id', isAuthenticated, isAdmin, deletUserAdmin);


//////////////////////////////////////////////////////////////////////////// 
////Operaciones comunes - realizadas por todos los usuarios/////////////////
///////////////////////////////////////////////////////////////////////////
router.get('/users/myProfile', isAuthenticated, myProfile);

router.get('/users/changePasswd', isAuthenticated, changePasswdForm);
router.post('/users/changePasswd', isAuthenticated, changePasswd);
///Cuando olvidamos la contraseña
router.get('/users/forgotPasswdForm', forgotPasswordForm);
router.post('/users/forgotPassword', forgotPassword)
////////////////////////////////////////////////////////////////////////////

module.exports = router;