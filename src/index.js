require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/database');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const cors = require('cors');
const { protect, admin } = require('./middlewares/auth');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

//conectar a la BD
conectarDB();


//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Ruta de productos
app.use('/api/users', userRoutes);
app.use('/api/products', protect, admin, productRoutes);
app.use('/api/admin/products', protect, admin, productRoutes);
app.use('/api/profile', protect, profileRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/cart', cartRoutes);


//Iniciar el servidors

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`servidor ejecutandose en el puerto: ${PORT}`);
});