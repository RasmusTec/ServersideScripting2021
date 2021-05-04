const express = require('express');
const logger = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev',{
    skip: req => !req.url.endsWith('.html') && req.url.indexOf('.') > -1
}));

const fileupload = require('express-fileupload');
app.use(fileupload({
    limits:{
        filesize: 10* 1024 * 1024
    }
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.set('view engine', 'ejs');
app.set('views','./views');

const mongoose = require("mongoose");
// starter mongoDb og opretter forbindelsen til databasen,
// også selv om variablen 'db' ikke benyttes
const db = mongoose.connect("mongodb://localhost:27017/world_db",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.static('./public'));

require('./routes')(app);

app.listen(port,()=>{
console.log(`Serveren kører... http://localhost:${port}`)
});