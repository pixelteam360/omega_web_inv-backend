"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const client_s3_1 = require("@aws-sdk/client-s3");
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure DigitalOcean Spaces
const s3Client = new client_s3_1.S3Client({
    region: "us-east-1",
    endpoint: process.env.DO_SPACE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY || "",
        secretAccessKey: process.env.DO_SPACE_SECRET_KEY || "",
    },
});
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Multer configuration using memoryStorage (for DigitalOcean & Cloudinary)
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// ✅ Fixed Cloudinary Storage
const cloudinaryStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        public_id: (req, file) => `${Date.now()}_${file.originalname}`,
    },
});
const cloudinaryUpload = (0, multer_1.default)({ storage: cloudinaryStorage });
// Upload single image
const uploadSingle = upload.single("image");
const uploadFile = upload.single("file");
// Upload multiple images
const uploadMultipleImage = upload.fields([{ name: "images", maxCount: 15 }]);
const workout = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "icon", maxCount: 1 },
    { name: "video", maxCount: 1 },
]);
const nutrition = upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "nutritionTips", maxCount: 15 },
]);
const post = upload.fields([
    { name: "images", maxCount: 15 },
    { name: "video", maxCount: 1 },
]);
// ✅ Fixed Cloudinary Upload (Now supports buffer)
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file) {
        throw new Error("File is required for uploading.");
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: "uploads",
            resource_type: "auto", // Supports images, videos, etc.
            use_filename: true,
            unique_filename: true,
        }, (error, result) => {
            if (error) {
                console.error("Error uploading file to Cloudinary:", error);
                return reject(error);
            }
            // ✅ Explicitly return `Location` and `public_id`
            resolve({
                Location: (result === null || result === void 0 ? void 0 : result.secure_url) || "", // Cloudinary URL
                public_id: (result === null || result === void 0 ? void 0 : result.public_id) || "",
            });
        });
        // Convert buffer to stream and upload
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    });
});
// ✅ Unchanged: DigitalOcean Upload
const uploadToDigitalOcean = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file) {
        throw new Error("File is required for uploading.");
    }
    try {
        const Key = `nathancloud/${Date.now()}_${(0, uuid_1.v4)()}_${file.originalname}`;
        const uploadParams = {
            Bucket: process.env.DO_SPACE_BUCKET || "",
            Key,
            Body: file.buffer, // ✅ Use buffer instead of file path
            ACL: "public-read",
            ContentType: file.mimetype,
        };
        // Upload file to DigitalOcean Spaces
        yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
        // Format the URL
        const fileURL = `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/${Key}`;
        return {
            Location: fileURL,
            Bucket: process.env.DO_SPACE_BUCKET || "",
            Key,
        };
    }
    catch (error) {
        console.error("Error uploading file to DigitalOcean:", error);
        throw error;
    }
});
// ✅ No Name Changes, Just Fixes
exports.fileUploader = {
    upload,
    uploadSingle,
    uploadMultipleImage,
    workout,
    nutrition,
    post,
    uploadFile,
    cloudinaryUpload,
    uploadToDigitalOcean,
    uploadToCloudinary,
};
