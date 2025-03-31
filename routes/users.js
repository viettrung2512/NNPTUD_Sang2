router.get('/', check_authentication, check_authorization(['mod']), async function(req, res) {
  try {
      let users = await userControllers.getAllUsers();
      res.send({ success: true, data: users });
  } catch (error) {
      res.status(500).send({ success: false, message: error.message });
  }
});

router.get('/:id', check_authentication, check_authorization(['mod']), async function(req, res) {
  try {
      if (req.params.id === req.user.id) {
          return res.status(403).send({ success: false, message: "Không thể xem thông tin của chính bạn" });
      }
      let user = await userControllers.getUserById(req.params.id);
      res.send({ success: true, data: user });
  } catch (error) {
      res.status(404).send({ success: false, message: error.message });
  }
});

router.post('/', check_authentication, check_authorization(['admin']), async function(req, res) {
  try {
      let newUser = await userControllers.createAnUser(req.body.username, req.body.password, req.body.email, req.body.role);
      res.status(200).send({ success: true, message: newUser });
  } catch (error) {
      res.status(404).send({ success: false, message: error.message });
  }
});

router.put('/:id', check_authentication, check_authorization(['admin']), async function(req, res) {
  try {
      let updatedUser = await userControllers.updateAnUser(req.params.id, req.body);
      res.status(200).send({ success: true, message: updatedUser });
  } catch (error) {
      res.status(404).send({ success: false, message: error.message });
  }
});

router.delete('/:id', check_authentication, check_authorization(['admin']), async function(req, res) {
  try {
      let deleteUser = await userControllers.deleteAnUser(req.params.id);
      res.status(200).send({ success: true, message: deleteUser });
  } catch (error) {
      res.status(404).send({ success: false, message: error.message });
  }
});
