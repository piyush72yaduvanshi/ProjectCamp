import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username should be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username should be at least 3 characters"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters"),
    body("fullname")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Fullname should be at least 3 characters"),
    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["admin", "project_admin", "member"])
      .withMessage("Role should be admin, project_admin or member"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email is invalid")
      .trim()
      .notEmpty()
      .withMessage("Email is required"),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
  ];
};

export { userRegisterValidator, userLoginValidator };
