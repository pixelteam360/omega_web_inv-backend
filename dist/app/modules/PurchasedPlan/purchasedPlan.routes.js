"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedPlanRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const purchasedPlan_controller_1 = require("./purchasedPlan.controller");
const client_1 = require("@prisma/client");
const purchasedPlan_validation_1 = require("./purchasedPlan.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get(purchasedPlan_controller_1.PurchasedPlanController.getPurchasedPlans)
    .post((0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(purchasedPlan_validation_1.PurchasedPlanValidation.CreatePurchasedPlanValidationSchema), purchasedPlan_controller_1.PurchasedPlanController.createPurchasedPlan);
router.get("/my-purchased", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), purchasedPlan_controller_1.PurchasedPlanController.getMyPurchasedPlan);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), purchasedPlan_controller_1.PurchasedPlanController.getSinglePurchasedPlan);
exports.PurchasedPlanRoutes = router;
