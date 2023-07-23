const express = require('express');
const app= express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
var morgan = require('morgan'); 

//Importing Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const loginRoutes = require('./routes/loginRoutes');
const signUpRoutes = require('./routes/signUpRoutes');

//Connecting to Database
mongoose.connect('mongodb+srv://sep:sep@superheros.3gh31.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(con =>{
    console.log(con.connections)
    console.log('DB connected')
});


app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

//Routes
app.use('/Users',userRoutes);
app.use('/Posts',postRoutes);
app.use('/Login',loginRoutes);
app.use('/Signup',signUpRoutes);

//Listen on port 9000
const port = process.env.PORT || 9000
app.listen(port, () => console.log('server started'));