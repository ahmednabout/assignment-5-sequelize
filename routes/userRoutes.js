const router = require("express").Router();
const c = require("../controllers/userController");
router.post("/signup", c.signup);
router.put("/:id", c.createOrUpdate);
router.get("/by-email", c.findByEmail);
router.get("/:id", c.getById);
module.exports = router;