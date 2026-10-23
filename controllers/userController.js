const { Op, ValidationError, UniqueConstraintError } = require("sequelize");
const { User } = require("../models");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    // Required: build() then save()
    const user = User.build({ name, email, password, role });
    await user.save();
    return res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors?.map(e => e.message) || [error.message] });
    }
    return res.status(500).json({ message: error.message });
  }
};

exports.createOrUpdate = async (req, res) => {
  try {
    const id = Number(req.params.id);
    let user = await User.findByPk(id);
    if (user) {
      // Required: skip validation option on update
      await user.update(req.body, { validate: false });
      return res.json({ message: "User updated", user });
    }
    user = await User.create({ ...req.body, id }, { validate: false });
    return res.status(201).json({ message: "User created", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.findByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Provide email query parameter" });
    const user = await User.findOne({ where: { email }, attributes: { exclude: ["password"] } });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["role", "password"] }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};