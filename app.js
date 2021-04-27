const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

const logger = require('morgan');
app.use(logger('dev'));

app.get('/',(req, res)=>{
    res.send('Hello World!');
});

app.listen(port,()=>{
console.log(`Serveren kører... http://localhost:${port}`)
});