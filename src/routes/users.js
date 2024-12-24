const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();

//Registro de usuario

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo electronico ya esta registrado' });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuario registrado con exito', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }

});

//iniciar sesion de usuario 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contrasena incorrecta' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Inicio de sesion exitoso', token });

    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesion', error });
    }
});

module.exports = router;



