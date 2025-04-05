var express = require('express');
var router = express.Router();
let Menu = require('../schemas/menu');
let { check_authentication, check_authorization } = require("../utils/check_auth");

// Lấy tất cả menu
router.get('/', async function(req, res) {
    try {
        let menus = await Menu.find().populate('parent', 'text'); // Lấy tên menu cha
        res.status(200).send({ success: true, data: menus });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// Lấy menu theo ID
router.get('/:id', async function(req, res) {
    try {
        let menu = await Menu.findById(req.params.id).populate('parent', 'text');
        if (!menu) return res.status(404).send({ success: false, message: "Menu không tồn tại" });

        res.status(200).send({ success: true, data: menu });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// Tạo menu (chỉ mod trở lên)
router.post('/', check_authentication, check_authorization(['mod']), async function(req, res) {
    try {
        let { text, url, order, parent } = req.body;
        let newMenu = new Menu({ text, url, order, parent });
        await newMenu.save();
        res.status(201).send({ success: true, data: newMenu });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

// Cập nhật menu (chỉ mod trở lên)
router.put('/:id', check_authentication, check_authorization(['mod']), async function(req, res) {
    try {
        let menu = await Menu.findById(req.params.id);
        if (!menu) return res.status(404).send({ success: false, message: "Menu không tồn tại" });

        Object.assign(menu, req.body);
        await menu.save();
        res.status(200).send({ success: true, data: menu });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

// Xóa menu (chỉ admin)
router.delete('/:id', check_authentication, check_authorization(['admin']), async function(req, res) {
    try {
        let menu = await Menu.findById(req.params.id);
        if (!menu) return res.status(404).send({ success: false, message: "Menu không tồn tại" });

        await menu.deleteOne();
        res.status(200).send({ success: true, message: "Menu đã bị xóa" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;
