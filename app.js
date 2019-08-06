// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');




// inicializar variables
var app = express();


// ******** Body-Parse ***********
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json


// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// importaciones de rutas
var appRoutes = require('./routes/app');
var busquedaRoutes = require('./routes/busqueda');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var usuarioRoutes = require('./routes/usuario');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var loginRoutes = require('./routes/login');

// Rutas
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);




// escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});