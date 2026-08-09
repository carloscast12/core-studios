import User from "../models/User.js";
import Follow from "../models/Follow.js";

export const getSuggestions = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.user.id }).distinct(
      "following",
    );
    const excluded = [...following, req.user.id];
    const suggestions = await User.find({ _id: { $nin: excluded } })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);
    return res.status(200).json(suggestions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) {
      return res.status(400).json({ message: "no puedes seguirte a ti mismo" });
    }
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    const createdFollow = await Follow.create({
      follower: req.user.id,
      following: userId,
    });
    return res.status(201).json(createdFollow);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "ya sigues a este usuario" });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await Follow.findOneAndDelete({
      follower: req.user.id,
      following: userId,
    });
    return res.status(200).json({ message: "dejaste de seguir al usuario" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
