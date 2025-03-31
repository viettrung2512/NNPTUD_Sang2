var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/product');
let categorySchema = require('../schemas/category');
let { check_authentication, check_authorization } = require("../utils/check_auth");

// GET: Không yêu cầu đăng nhập
router.get('/', async function(req, res) {
    let products = await productSchema.find({}).populate({ path: 'category', select: 'name' });
    res.status(200).send({ success: true, data: products });
});

// GET/:id: Không yêu cầu đăng nhập
router.get('/:id', async function(req, res) {
    try {
        let product = await productSchema.findById(req.params.id);
        res.status(200).send({ success: true, data: product });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

// POST: Chỉ mod trở lên mới có quyền tạo
router.post('/', check_authentication, check_authorization(['mod']), async function(req, res) {
    try {
        let body = req.body;
        let category = await categorySchema.findOne({ name: body.category });
        if (!category) {
            return res.status(404).send({ success: false, message: "Danh mục không tồn tại" });
        }
        let newProduct = new productSchema({ name: body.name, price: body.price || 0, quantity: body.quantity || 0, category: category._id });
        await newProduct.save();
        res.status(200).send({ success: true, data: newProduct });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

// PUT: Chỉ mod trở lên mới có quyền cập nhật
router.put('/:id', check_authentication, check_authorization(['mod']), async function(req, res) {
    try {
        let product = await productSchema.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ success: false, message: "ID không tồn tại" });
        }
        Object.assign(product, req.body);
        await product.save();
        res.status(200).send({ success: true, data: product });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

// DELETE: Chỉ admin có quyền xóa
router.delete('/:id', check_authentication, check_authorization(['admin']), async function(req, res) {
    try {
        let product = await productSchema.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ success: false, message: "ID không tồn tại" });
        }
        product.isDeleted = true;
        await product.save();
        res.status(200).send({ success: true, data: product });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

module.exports = router;
