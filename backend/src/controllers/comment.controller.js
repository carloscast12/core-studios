import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { text } = req.body;
    const commentCreated = await Comment.create({
      user: req.user.id,
      post: id,
      text,
    });
    return res.status(201).json(commentCreated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await Comment.findById(id);
    if (req.user.role !== "admin" && comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "no autorizado" });
    }
    await Comment.findByIdAndDelete(id);
    return res.status(200).json({ message: "comentario eliminado" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default { createComment, deleteComment };
