const {Router} = require('express')
const router =Router();

const {isAuthenticated, isAdmin, isEmple, isCustomer, isAdminCustomer} = require('../helpers/auth');

const { createRequest, createRequestForm, obtainDate, seeAllCreateRequest, cancelRequest, assignTo, pendingRequest, finished,
            declineRequest, finishedRequest } = require('../controllers/request.controllers');

//Crear examenes nuevos

router.post('/request/createRequest', isAuthenticated, isCustomer, createRequest);

//Agendar mantenimientos
router.get('/request/createRequestForm', isAuthenticated, isCustomer, createRequestForm);//ya
router.post('/request/obtainDate', isAuthenticated, isCustomer, obtainDate);

//ver los mantenimientos pendientes por asignar
router.get('/request/seeAllCreateRequest', isAuthenticated, isAdmin, seeAllCreateRequest);//ya

//cancelar mantenimientos
router.put('/request/cancelRequest/:id', isAuthenticated, isAdmin, cancelRequest);

//asignar mantenimiento
router.put('/request/assignTo/:id', isAuthenticated, isAdmin, assignTo);

//ver mantenimientos pendientes
router.get('/request/pendingRequest', isAuthenticated, pendingRequest);//*

//ver mantenimientos rechazados
router.get('/request/declineRequest', isAuthenticated, isAdminCustomer, declineRequest);//*

//ver mantenimientos finalizados
router.get('/request/finishedRequest', isAuthenticated, finishedRequest);//*

//finalizar mantenimiento
router.put('/request/finished/:id', isAuthenticated, isEmple, finished);

module.exports = router;