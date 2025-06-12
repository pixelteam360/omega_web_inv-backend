import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { UserInfoRoutes } from "../modules/UserInfo/userInfo.routes";
import { FitnessGoalRoutes } from "../modules/FitnessGoal/fitnessGoal.routes";
import { WorkoutRoutes } from "../modules/Workout/workout.routes";
import { NutritionRoutes } from "../modules/Nutrition/nutrition.routes";
import { BodyMeasurementRoutes } from "../modules/BodyMeasurement/bodyMeasurement.routes";
import { WorkoutPlansRoutes } from "../modules/WorkoutPlans/workoutPlans.routes";
import { MealPlansRoutes } from "../modules/MealPlans/mealPlans.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/users-info",
    route: UserInfoRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/fitness-goal",
    route: FitnessGoalRoutes,
  },
  {
    path: "/workout",
    route: WorkoutRoutes,
  },
  {
    path: "/nutrition",
    route: NutritionRoutes,
  },
  {
    path: "/body-measurement",
    route: BodyMeasurementRoutes,
  },
  {
    path: "/workout-plans",
    route: WorkoutPlansRoutes,
  },
  {
    path: "/meal-plans",
    route: MealPlansRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
