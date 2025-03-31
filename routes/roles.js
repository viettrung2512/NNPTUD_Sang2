router.post('/', check_authentication, check_authorization(['admin']), async function(req, res) {
  try {
      let newRole = new roleSchema({ name: req.body.name });
      await newRole.save();
      res.status(200).send({ success: true, data: newRole });
  } catch (error) {
      res.status(404).send({ success: false, message: error.message });
  }
});
