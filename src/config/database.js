const mongoose = require('mongoose');

const conectarDB = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Detiene la aplicación si no se puede conectar
    }
};

module.exports = conectarDB;