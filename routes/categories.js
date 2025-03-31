var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category');
let { check_authentication, check_authorization } = require("../utils/check_auth");

// GET: Không yêu cầu đăng nhập
router.get('/', async function(req, res) {
    try {
        let categories = await categorySchema.find({});
        res.status(200).send({ success: true, data: categories });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// POST: Chỉ mod trở lên mới có quyền tạo danh mục
router.post('/', check_authentication, check_authorization(['mod']), async function(req, res) {
    try {
        let newCategory = new categorySchema({ name: req.body.name });
        await newCategory.save();
        res.status(200).send({ success: true, data: newCategory });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

// PUT: Chỉ mod trở lên mới có quyền cập nhật danh mục
router.put('/:id', check_authentication, check_authorization(['mod']), async function(req, res) {
    try {
        let category = await categorySchema.findById(req.params.id);
        if (!category) {
            return res.status(404).send({ success: false, message: "Danh mục không tồn tại" });
        }
        category.name = req.body.name;
        await category.save();
        res.status(200).send({ success: true, data: category });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

// DELETE: Chỉ admin có quyền xóa danh mục
router.delete('/:id', check_authentication, check_authorization(['admin']), async function(req, res) {
    try {
        let category = await categorySchema.findById(req.params.id);
        if (!category) {
            return res.status(404).send({ success: false, message: "Danh mục không tồn tại" });
        }
        await category.deleteOne();
        res.status(200).send({ success: true, message: "Danh mục đã bị xóa" });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

module.exports = router;