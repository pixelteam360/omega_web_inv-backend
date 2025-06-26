"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const userInfo_routes_1 = require("../modules/UserInfo/userInfo.routes");
const fitnessGoal_routes_1 = require("../modules/FitnessGoal/fitnessGoal.routes");
const workout_routes_1 = require("../modules/Workout/workout.routes");
const nutrition_routes_1 = require("../modules/Nutrition/nutrition.routes");
const bodyMeasurement_routes_1 = require("../modules/BodyMeasurement/bodyMeasurement.routes");
const workoutPlans_routes_1 = require("../modules/WorkoutPlans/workoutPlans.routes");
const mealPlans_routes_1 = require("../modules/MealPlans/mealPlans.routes");
const post_routes_1 = require("../modules/Post/post.routes");
const notification_routes_1 = require("../modules/Notification/notification.routes");
const admin_routes_1 = require("../modules/Admin/admin.routes");
const plan_routes_1 = require("../modules/Plan/plan.routes");
const purchasedPlan_routes_1 = require("../modules/PurchasedPlan/purchasedPlan.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/users-info",
        route: userInfo_routes_1.UserInfoRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/fitness-goal",
        route: fitnessGoal_routes_1.FitnessGoalRoutes,
    },
    {
        path: "/workout",
        route: workout_routes_1.WorkoutRoutes,
    },
    {
        path: "/nutrition",
        route: nutrition_routes_1.NutritionRoutes,
    },
    {
        path: "/body-measurement",
        route: bodyMeasurement_routes_1.BodyMeasurementRoutes,
    },
    {
        path: "/workout-plans",
        route: workoutPlans_routes_1.WorkoutPlansRoutes,
    },
    {
        path: "/meal-plans",
        route: mealPlans_routes_1.MealPlansRoutes,
    },
    {
        path: "/post",
        route: post_routes_1.PostRoutes,
    },
    {
        path: "/notification",
        route: notification_routes_1.NotificationRoutes,
    },
    {
        path: "/admin",
        route: admin_routes_1.AdminRoutes,
    },
    {
        path: "/plans",
        route: plan_routes_1.PlanRoutes,
    },
    {
        path: "/purchased-plans",
        route: purchasedPlan_routes_1.PurchasedPlanRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
