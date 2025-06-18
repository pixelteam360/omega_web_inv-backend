"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const zod_1 = require("zod");
const PostValidationSchema = zod_1.z.object({
    description: zod_1.z.string(),
});
exports.PostValidation = {
    PostValidationSchema
};
