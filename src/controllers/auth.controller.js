import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail,emailVerificationMailgenContent } from "../utils/mail.js";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.enerateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating accesstokens", []);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  if (!email || !username || !password || !role)
    throw new ApiError(400, "All fields are required", []);
  const existingUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (existingUser)
    throw new ApiError(409, "User with email or username already exists", []);
  const user = await User.create({
    email,
    username,
    password,
    role,
    isEmailerVerified: false,
  });

  const { UnHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: " Please Verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user?.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${UnHashedToken}`,
    ),
  });

  const createdUser = await User
    .findById(user._id)
    .select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

  if (!createdUser) throw new ApiError(500, "Error creating user", []);
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { createdUser },
        "User Registered successfully and email sent for verification",
      ),
    );
});


export { registerUser };
