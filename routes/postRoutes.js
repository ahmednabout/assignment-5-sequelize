const router = require("express").Router();
const c = require("../controllers/postController");
router.post("/", c.create);
router.delete("/:postId", c.remove);
router.get("/details", c.details);
router.get("/comment-count", c.commentCount);
module.exports = router;