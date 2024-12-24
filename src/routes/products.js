const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.post('/', async (req, res) => {

    const { name, description, price, category, stock } = req.body;

    try {
        const newProduct = new Product({ name, description, price, category, stock });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(400).json({ message: 'Error al crear el producto', error: error.message, stack: error.stack });
    }
});



router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }

});



router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(updateProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el producto', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deleteProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});

module.exports = router;
