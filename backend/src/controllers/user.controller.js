import mongoose from "mongoose";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Booking from "../models/Booking.js";
import Membership from "../models/Membership.js";

export const getProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const profileUser = await User.findById(id).select("-password");
    return res.status(200).json(profileUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const updatedProfile = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");
    return res.status(200).json(updatedProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const id = req.user.id;
    const updatedProfile = await User.findByIdAndUpdate(
      id,
      { avatar: req.file.secure_url },
      { new: true },
    ).select("-password");
    return res.status(200).json(updatedProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTotalLikes = async (id) => {
  const result = await Post.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(id) } },
    { $project: { likesCount: { $size: "$likes" } } },
    { $group: { _id: null, total: { $sum: "$likesCount" } } },
  ]);
  return result[0]?.total || 0;
};

export const getStats = async (req, res) => {
  try {
    const id = req.user.id;
    const [followers, following, posts, likes] = await Promise.all([
      Follow.countDocuments({ following: id }),
      Follow.countDocuments({ follower: id }),
      Post.countDocuments({ user: id }),
      getTotalLikes(id),
    ]);
    return res.status(200).json({ followers, following, posts, likes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const profileUser = await User.findById(req.params.id).select("-password");
    if (!profileUser) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    return res.status(200).json(profileUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const id = req.params.id;
    const [followers, following, posts] = await Promise.all([
      Follow.countDocuments({ following: id }),
      Follow.countDocuments({ follower: id }),
      Post.countDocuments({ user: id }),
    ]);
    return res.status(200).json({ followers, following, posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "no autorizado" });
    }
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ message: "no puedes eliminarte a ti mismo" });
    }
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }

    const userPosts = await Post.find({ user: id }).select("_id");
    const postIds = userPosts.map((p) => p._id);

    await Promise.all([
      Post.deleteMany({ user: id }),
      Comment.deleteMany({ $or: [{ user: id }, { post: { $in: postIds } }] }),
      Booking.deleteMany({ user: id }),
      Follow.deleteMany({ $or: [{ follower: id }, { following: id }] }),
      Membership.deleteOne({ user: id }),
      User.findByIdAndDelete(id),
    ]);

    return res.status(200).json({ message: "usuario eliminado" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "no autorizado" });
    }
    const follows = await Follow.find({ following: req.params.id }).populate(
      "follower",
      "-password",
    );
    return res.status(200).json(follows.map((f) => f.follower).filter(Boolean));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "no autorizado" });
    }
    const follows = await Follow.find({ follower: req.params.id }).populate(
      "following",
      "-password",
    );
    return res.status(200).json(follows.map((f) => f.following).filter(Boolean));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
