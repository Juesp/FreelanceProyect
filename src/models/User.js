const {Schema, model} = require('mongoose');
bcrypt = require('bcryptjs');

const UserSchema = Schema({
/////////////// Información personal ///////////////////
    identification_type: {
        type: String
    },
    identification: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    sec_lastname: {
        type: String
    }, 

////////////// Información general ///////////////////
    date_of_bird: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
////////////// Datos de localización ///////////////////
    
    mobile_phone: {
        type: String
    },

    role: {
        type: String,   
        required: true,
        default: "Cliente",
        enum: ["Admin", "Cliente", "Empleado"]
    },

    email: {
        type: String,
        required: true,        
        unique: true
    }, 
    password: {
        type: String,
        required: true,                
    },
/////////////////////  company   ///////////////////////
    company_name: {
        type: String,
        required: true,                
    },
    nit: {
        type: String,
        required: true,                
    },
    company_city: {
        type: String,
        required: true,                
    },
    company_department: {
        type: String,
        required: true,                
    },
    company_address: {
        type: String,
        required: true,                
    },
    company_phone: {
        type: String,
        required: true,                
    },
    legal_name: {
        type: String,
        required: true,                
    },
    legal_lastname: {
        type: String,
        required: true,                
    },
    legal_sec_lastname: {
        type: String,
    },
    legal_type_identification: {
        type: String,
        required: true,                
    },
    legal_number_identification: {
        type: String,
        required: true,                
    },
    legal_mobile_number: {
        type: String,
        required: true,                
    },

////////////////////////////////////////////
    last_login_date: {
        type: Date,
        default: Date.now()
    }         
},{
        timestamps: true
});

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = model('User', UserSchema);