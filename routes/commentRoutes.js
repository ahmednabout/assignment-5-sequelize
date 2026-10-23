const router = require("express").Router();
const c = require("../controllers/commentController");
router.post("/", c.bulkCreate);
router.patch("/:commentId", c.update);
router.post("/find-or-create", c.findOrCreate);
router.get("/search", c.search);
router.get("/newest/:postId", c.newest);
router.get("/details/:id", c.details);
module.exports = router;