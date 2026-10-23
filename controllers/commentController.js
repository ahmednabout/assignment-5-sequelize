const { Op } = require("sequelize");
const { User, Post, Comment } = require("../models");

exports.bulkCreate = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ message: "Send an array of comments in the request body" });
    const comments = await Comment.bulkCreate(req.body, { validate: true });
    return res.status(201).json(comments);
  } catch (error) { return res.status(400).json({ message: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) return res.status(400).json({ message: "userId and content are required" });
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (Number(comment.userId) !== Number(userId)) return res.status(403).json({ message: "Only the owner can update this comment" });
    comment.content = content;
    await comment.save();
    return res.json(comment);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.findOrCreate = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    if (!postId || !userId || !content) return res.status(400).json({ message: "postId, userId and content are required" });
    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content }
    });
    return res.status(created ? 201 : 200).json({ created, comment });
  } catch (error) { return res.status(400).json({ message: error.message }); }
};

exports.search = async (req, res) => {
  try {
    const { word } = req.query;
    if (!word) return res.status(400).json({ message: "Provide word query parameter" });
    const where = { content: { [Op.like]: `%${word}%` } };
    const [comments, count] = await Promise.all([
      Comment.findAll({ where }),
      Comment.count({ where })
    ]);
    return res.json({ count, comments });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.newest = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [["createdAt", "DESC"]],
      limit: 3
    });
    return res.json(comments);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.details = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Post, as: "post", attributes: ["id", "title", "content"] }
      ]
    });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    return res.json(comment);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};