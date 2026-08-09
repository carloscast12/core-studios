import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const images = (req.files || []).map((file) => file.secure_url);
    if (text.length > 120) {
      return res.status(400).json({ message: "máximo 120 caracteres" });
    }
    const createdPost = new Post({ user: req.user.id, text, images });
    await createdPost.save();
    return res.status(201).json(createdPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filter = req.query.user ? { user: req.query.user } : {};
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "-password");
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const findPost = await Post.findById(id);
    if (req.user.role !== "admin" && findPost.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "no autorizado" });
    }
    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "post eliminado" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "post no encontrado" });
    }
    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: req.user.id } });
    } else {
      await Post.findByIdAndUpdate(id, { $push: { likes: req.user.id } });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const onePost = await Post.findById(id).populate("user", "-password");
    const postComments = await Comment.find({ post: id }).populate(
      "user",
      "-password",
    );
    return res.status(200).json({ post: onePost, comments: postComments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
