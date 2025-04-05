var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/product');
let categorySchema = require('../schemas/category');

// Route: Lấy tất cả sản phẩm theo category slug
router.get('/api/:categoryslug', async function (req, res) {
    try {
        let category = await categorySchema.findOne({ slug: req.params.categoryslug });
        if (!category) {
            return res.status(404).send({ success: false, message: "Danh mục không tồn tại" });
        }
        let products = await productSchema.find({ category: category._id });
        res.status(200).send({ success: true, data: products });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// Route: Lấy chi tiết sản phẩm theo category slug và product slug
router.get('/api/:categoryslug/:productslug', async function (req, res) {
    try {
        let category = await categorySchema.findOne({ slug: req.params.categoryslug });
        if (!category) {
            return res.status(404).send({ success: false, message: "Danh mục không tồn tại" });
        }
        let product = await productSchema.findOne({ slug: req.params.productslug, category: category._id });
        if (!product) {
            return res.status(404).send({ success: false, message: "Sản phẩm không tồn tại" });
        }
        res.status(200).send({ success: true, data: product });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;
