const { sequelize } = require("sequelize");
const { User, Post, Comment } = require("../models");

exports.create = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    if (!title || !content || !userId) return res.status(400).json({ message: "title, content and userId are required" });
    const owner = await User.findByPk(userId);
    if (!owner) return res.status(404).json({ message: "User not found" });

    // Required: create with new instance and save()
    const post = new Post({ title, content, userId });
    await post.save();
    return res.status(201).json(post);
  } catch (error) { return res.status(400).json({ message: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    // Pass the requesting user's ID in body: { "userId": 1 }
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Provide userId in request body" });
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (Number(post.userId) !== Number(userId)) return res.status(403).json({ message: "Only the owner can delete this post" });
    await post.destroy(); // paranoid soft-delete
    return res.json({ message: "Post soft-deleted successfully" });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.details = async (_req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
        { model: Comment, as: "comments", attributes: ["id", "content"] }
      ]
    });
    return res.json(posts);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.commentCount = async (_req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id", "title", "content", "userId", "createdAt", "updatedAt",
        [require("../config/database").literal("(SELECT COUNT(*) FROM Comments AS c WHERE c.postId = Post.id)"), "commentsCount"]
      ]
    });
    return res.json(posts);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};