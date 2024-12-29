const Cart = require('../models/Cart');
const Order = require('../models/Order.js');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ message: 'La direccion de envio es requerida' });
        }
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "El carrito esta vacio" });
        }

        const orderItems = cart.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            total: item.total,
        }));

        const order = new Order({
            userId,
            items: orderItems,
            subtotal: cart.subtotal,
            discount: cart.discount,
            totalPrice: cart.totalPrice,
            address,
            paymentStatus: 'pending',
            orderStatus: 'processing',

        });

        await order.save();

        cart.items = [];
        cart.coupons = [];
        cart.subtotal = 0;
        cart.discount = 0;
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ message: "Pedido creado con exito", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al crear pedido", error });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener pedido' })
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado, se necesita privilegios de administrador' });
        }
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener los pedidos' });
    }
};

// exports.getOrderById = async (req, res) => {
//     try {
//         const orderId = req.params.id;
//         const userId = req.user.id;

//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: 'Pedido no encontrado' });
//         }
//         if (order.userId.toString() !== userId && req.user.role !== 'admin') {
//             return res.status(403).json({ message: 'No autorizado, solo puedes ver tus pedidos' });
//         }
//         res.status(200).json({ order });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Huno un error al obtener el pedido', error });
//     }
// };
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Permitir a los administradores o al usuario propietario del pedido acceder
        if (req.user.role !== 'admin' && order.userId.toString() !== userId) {
            return res.status(403).json({ message: 'No autorizado, solo puedes ver tus pedidos' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error('Error en getOrderById:', error);
        res.status(500).json({ message: 'Hubo un error al obtener el pedido', error });
    }
};



exports.updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado , se necesitan permisos de administrador' });
        }
        const { status } = req.body;
        const orderId = req.params.id;

        const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(404).json({ message: 'Estado no valido' });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        order.orderStatus = status;
        await order.save();
        res.status(200).json({ message: 'Estado del pedido actualizado con exito', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al actualizar el estado  del pedido', error });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Np autorizado, se necesita privilegios de administrador ' });
        }

        const orderId = req.params.id;
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Pedido eliminado con exito' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al eliminar el pedido', error });

    }
};