const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

dotenv.config();

//middleware para verificar si el usuario esta autentificado

const protect = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No se a proporcionado un token ' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token', decoded);
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            return res.status(400).json({ message: 'Id de usuario no valido' })
        }
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token no valido' });
    }
};

//middleware para verificar si el usuario es admin 

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'No autorizado, se neecsita privilegios de administrador ' });

    }
};

module.exports = { protect, admin };