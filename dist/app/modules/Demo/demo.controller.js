"use strict";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import { userService } from "./demo.service";
// import pick from "../../../shared/pick";
// import { userFilterableFields } from "./demo.costant";
// const createUser = catchAsync(async (req, res) => {
//   const result = await userService.createUserIntoDb(req.body);
//   sendResponse(res, {
//     message: "User Registered successfully!",
//     data: result,
//   });
// });
// const getUsers = catchAsync(async (req, res) => {
//   const filters = pick(req.query, userFilterableFields);
//   const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
//   const result = await userService.getUsersFromDb(filters, options);
//   sendResponse(res, {
//     message: "Users retrieve successfully!",
//     data: result,
//   });
// });
// const getSingleUser = catchAsync(async (req, res) => {
//   const result = await userService.getSingleUser(req.params.id);
//   sendResponse(res, {
//     message: "User profile retrieved successfully",
//     data: result,
//   });
// });
// const updateProfile = catchAsync(async (req, res) => {
//   const { id } = req?.user;
//   const result = await userService.updateProfile(req.body, req.file, id);
//   sendResponse(res, {
//     message: "Profile updated successfully!",
//     data: result,
//   });
// });
// export const userController = {
//   createUser,
//   getUsers,
//   getSingleUser,
//   updateProfile,
// };
