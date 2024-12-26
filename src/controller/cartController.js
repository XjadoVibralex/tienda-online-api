const Cart = require('../models/Cart');
const Product = require('../models/Product');

// exports.addItemToCart = async (req, res) => {
//     const { productId, quantity } = req.body;

//     try {
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Producto no encontrado' });
//         }
//         if (product.stock < quantity) {
//             return res.status(400).json({ message: 'Stock insuficiente' });
//         }

//         const cart = await Cart.findOne({ userId: req.user._id });
//         if (!cart) {
//             cart = new Cart({ userId: req.user._id, items: [] });

//         }
//         const item = cart.items.find(item => item.productId.toString() === productId);

//         if (item) {
//             item.quantity += quantity;
//             item.total = item.quantity * (item.price - item.discount);
//         } else {
//             cart.items.push({
//                 productId,
//                 quantity,
//                 price: product.price,
//                 total: quantity * product.price,
//             });
//         }

//         cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
//         cart.totalPrice = cart.subtotal - cart.discount;

//         await cart.save();
//         res.status(200).json({ message: 'Producto anadido al carrito', cart });
//     } catch (error) {
//         res.status(500).json({ message: 'Error al anadir el producto', error });

//     }
// };
exports.addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Verificar que los datos productId y quantity se reciben correctamente
        console.log('Product ID:', productId); // Cambiado para depuración
        console.log('Quantity:', quantity); // Cambiado para depuración

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuficiente' });
        }

        // Verificar que req.user._id esté definido y correcto
        console.log('User ID:', req.user._id); // Cambiado para depuración

        // Si no se encuentra el carrito, lo creamos
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] }); // Crear carrito si no existe
            console.log('Carrito creado:', cart); // Cambiado para depuración
        }

        const item = cart.items.find(item => item.productId.toString() === productId);

        if (item) {
            item.quantity += quantity;
            item.total = item.quantity * (item.price - item.discount);
        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.price,
                total: quantity * product.price,
            });
        }

        cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        cart.totalPrice = cart.subtotal - cart.discount;

        await cart.save();
        res.status(200).json({ message: 'Producto anadido al carrito', cart });
    } catch (error) {
        // Mostramos el error completo para depurar
        console.log('Error al añadir el producto:', error); // Cambiado para depuración
        res.status(500).json({ message: 'Error al anadir el producto', error });
    }
};

exports.applyCoupon = async (req, res) => {
    const { code, discount } = req.body;

    console.log("Código del cupón:", code);
    console.log("Descuento:", discount);

    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        console.log("Carrito encontrado:", cart);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Agregar el cupón
        cart.coupons.push({ code, discount });
        console.log("Cupones en el carrito después de agregar:", cart.coupons);

        // Verificación de descuento
        if (discount > 0 && discount <= cart.subtotal) {
            cart.discount += discount;
            cart.totalPrice = cart.subtotal - cart.discount;
            console.log("Descuento aplicado. Nuevo total:", cart.totalPrice);
        } else {
            console.log("Descuento no válido. No se aplica.");
            return res.status(400).json({ message: 'Descuento no válido' });
        }

        await cart.save();
        res.status(200).json({ message: 'Cupón aplicado', cart });
    } catch (error) {
        console.error("Error al aplicar el cupón:", error); // Log de errores
        res.status(500).json({ message: 'Error al aplicar el cupón', error });
    }
};


// exports.applyCoupon = async (req, res) => {
//     const { code, discount } = req.body;

//     try {
//         const cart = await Cart.findOne({ userId: req.user._id });
//         if (!cart) {
//             return res.status(404).json({ messahe: 'Carrito no encontrado' });
//         }
//         cart.coupons.push({ code, discount });
//         cart.discount += discount;
//         cart.totalPrice = cart.subtotal - cart.discount;

//         await cart.save();
//         res.status(200).json({ message: 'Cupon aplicado', cart });
//     } catch (error) {
//         res.status(500).json({ message: 'Error al aplicar el cupon', error });

//     }
// };

exports.getCart = async (req, res) => {
    try {
        // Asegúrate de que 'items.productId' coincida con el campo en el esquema
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(200).json({ cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error); // Agregar logs para depuración
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
};

const mongoose = require('mongoose'); // Necesario para validar ObjectId

exports.removeItemFromCart = async (req, res) => {
    const { productId } = req.params;

    // Verificar si el productId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'ID de producto no válido' });
    }

    try {
        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Mostrar los detalles del carrito antes de la operación
        console.log("Carrito encontrado:", cart);

        // Filtrar el producto a eliminar y eliminar cualquier entrada con productId == null
        cart.items = cart.items.filter(item => {
            if (item.productId && item.productId.toString() === productId) {
                return false; // No incluimos esta entrada en el nuevo array si se corresponde con productId
            }
            return true;
        });

        // Mostrar los detalles del carrito después de la operación
        console.log("Carrito después de eliminar el producto:", cart);

        // Recalcular el subtotal
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);

        // Actualizar el totalPrice
        cart.totalPrice = cart.subtotal - cart.discount;

        // Guardar el carrito actualizado
        await cart.save();

        // Devolver el carrito actualizado en la respuesta
        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error("Error al eliminar producto:", error); // Agregar detalles del error en los logs
        res.status(500).json({ message: 'Error al eliminar producto', error });
    }
};



// exports.removeItemFromCart = async (req, res) => {
//     const { productId } = req.params;

//     try {
//         // Buscar el carrito del usuario
//         const cart = await Cart.findOne({ userId: req.user._id });

//         if (!cart) {
//             return res.status(404).json({ message: 'Carrito no encontrado' });
//         }

//         // Filtrar el producto a eliminar
//         cart.items = cart.items.filter(item => item.productId.toString() !== productId);


//         // Recalcular el subtotal y el precio total
//         cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
//         cart.totalPrice = cart.subtotal - cart.discount;

//         // Guardar los cambios en el carrito
//         await cart.save();

//         res.status(200).json({ message: 'Producto eliminado del carrito', cart });
//     } catch (error) {
//         res.status(500).json({ message: 'Error al eliminar producto', error });
//     }
// };


exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.items = [];
        cart.coupons = [];
        cart.subtotal = 0;
        cart.discount = 0;
        cart.totalPrice = 0;

        await cart.save();
        res.status(200).json({ message: 'Carrito vaciado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
};

exports.migrateCart = async (req, res) => {
    const { tempCart } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user._id }) || new Cart({ userId: req.user._id });
        tempCart.forEach(tempItem => {
            const item = cart.items.find(item => item.productId.toString() === tempItem.producId);
            if (item) {
                item.quantity += tempItem.quantity;
                item.total = item.quantity * (item.price - item.discount);
            } else {
                cart.items.push(tempItem);
            }

        });
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        cart.totalPrice = cart.subtotal - cart.discount;

        await cart.save();
        res.status(200).json({ message: 'Carrito migrado con exito', cart });

    } catch (error) {
        res.status(500).json({ message: 'Error al migrar el carrito', error });
    }


};