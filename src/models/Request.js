const {Schema, model} = require('mongoose');

const RequestSchema = new Schema ({

    date_of_request: {
        type: String
    },
    company_request: {
        type: String
    },
    company_request_ad: {
        type: String
    },
    company_request_city: {
        type: String
    },
    company_request_pho: {
        type: String
    },
    request_by: {
        type: String
    },
    date_of_maintenance: {
        type: String
    },
    hour_of_maintenance: {
        type: String
    },
    description: {
        type: String
    },
    notes: {
        type: String
    },
    state: {
        type: String
    },
    //se relaciona con la tabla de usuarios, en este caso el empleado al que se le asigna
    employee_rel: {
        type: String
    },
    employee_fullname: {
        type: String
    },
    company_rel: {
        type: String
    }

    //////////////////////////////////////
    /*last_login_date: {
        type: Date,
        default: Date.now()
    }         */
},{
        timestamps: true
});

module.exports = model('Request', RequestSchema);