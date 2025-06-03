import { User } from "../Models/user.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";

// Get Logged-in User Profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password -refreshToken");
        
    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, user, "User profile retrieved successfully")
    );
});

// Update Logged-in User Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Find the logged-in user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    // Update only the fields provided in the request
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
        // Check if the new email is already taken
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
            throw new ErrorHandler(400, "Email already in use by another user");
        }
        user.email = email;
    }
    if (password) {
        user.password = password; // Ensure password hashing is handled in your pre-save middleware
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with updated user details
    res.status(200).json(
        new ApiResponseHandler(200, {
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
        }, "User profile updated successfully")
    );
});


// Delete User Profile

export const deleteUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    await User.deleteOne({ _id: req.user._id }); // Replace remove() with deleteOne()

    return res.status(200).json(
        new ApiResponseHandler(200, null, "User profile deleted successfully")
    );
});




export const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if(!userId) {
        throw new ErrorHandler(403, "Please provide user id");
    }

    const user = await User.find({_id: userId});

    if(!user) {
        throw new ErrorHandler(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, user, "User fetched successfully")
    );
}) 

// Get All Users
export const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch all users except their password and refreshToken for security purposes
    const users = await User.find().select("-password -refreshToken");

    if (!users || users.length === 0) {
        throw new ErrorHandler(404, "No users found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, users, "Users retrieved successfully")
    );
});

