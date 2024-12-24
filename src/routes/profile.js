const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

//obtener el del usuario autenticado
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el peril', error });
    }
});

//Actualizar la informacion del perfil
router.put('/', protect, async (req, res) => {
    const { name, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Perfil actualizado con exito', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil', error });
    }
});

//cambiar contrasena
router.put('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contrasena actual es incorrecta' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: 'Contrasena actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar contrasena', error });
    }
});

module.exports = router;