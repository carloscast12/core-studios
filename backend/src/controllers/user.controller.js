import User from "../models/User.js";

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

export default { getProfile, updateProfile };
