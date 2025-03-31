var express = require('express');
var router = express.Router();
let userControllers = require('../controllers/user');
let { check_authentication } = require("../utils/check_auth");

// Đăng nhập
router.post('/login', async function(req, res) {
    try {
        let result = await userControllers.login(req.body.username, req.body.password);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        res.status(401).send({ success: false, message: error.message });
    }
});

// Đăng ký
router.post('/register', async function(req, res) {
    try {
        let newUser = await userControllers.register(req.body.username, req.body.password, req.body.email);
        res.status(200).send({ success: true, data: newUser });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

// Lấy thông tin người dùng đang đăng nhập
router.get('/me', check_authentication, async function(req, res) {
    try {
        let user = await userControllers.getUserById(req.user.id);
        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

// Đổi mật khẩu
router.put('/changepassword', check_authentication, async function(req, res) {
    try {
        let result = await userControllers.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
        res.status(200).send({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

module.exports = router;