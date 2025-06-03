import { Profile } from "../Models/profile.model.js";

// Get logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const { _id: userId } = req.user; // Extract user ID from `req.user`
    
    // Fetch the profile based on the logged-in user's ID
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update logged-in user's profile
const updateUserProfile = async (req, res) => {
  try {
    const { _id: userId } = req.user; // Extract user ID from `req.user`
    const updates = req.body;

    const profile = await Profile.findOneAndUpdate({ userId }, updates, { new: true });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete logged-in user's profile
const deleteUserProfile = async (req, res) => {
  try {
    const { _id: userId } = req.user; // Extract user ID from `req.user`

    const profile = await Profile.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { getUserProfile, updateUserProfile, deleteUserProfile };
