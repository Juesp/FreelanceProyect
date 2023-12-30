const mongoose = require('mongoose')

//const MONGODB_URI = process.env.MONGODB_URI
//const PSA_APP_HOST = process.env.PSA_APP_HOST;
//const PSA_APP_DATABASE = process.env.PSA_APP_DATABASE;
const {LCA_APP_HOST, LCA_APP_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${LCA_APP_HOST}/${LCA_APP_DATABASE}`;

//mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));
    