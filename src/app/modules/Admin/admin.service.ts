import prisma from "../../../shared/prisma";

const dashboardOverView = async () => {
  const users = await prisma.user.count();
  const plans = await prisma.plan.count();
  const fitnessGoal = await prisma.fitnessGoal.count();
  const workout = await prisma.workout.count();
  const nutrition = await prisma.nutrition.count();
  const progress = await prisma.user.count();
  const trainerSupport = await prisma.room.count({
    where: { roomType: "TRAINER" },
  });
  const nutritionSupport = await prisma.room.count({
    where: { roomType: "NUTRITION" },
  });

  return {
    users,
    plans,
    fitnessGoal,
    workout,
    nutrition,
    progress,
    trainerSupport,
    nutritionSupport,
  };
};

const userProgress = async (id: string) => {
  const res = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      userInfo: {
        select: { image: true, fullName: true },
      },
      bodyMeasurement: true,
      weightProgress: true,
    },
  });

  const workout = await prisma.workoutPlans.findMany({
    where: { userId: id },
  });
  const meal = await prisma.mealPlans.findMany({
    where: { userId: id },
  });

  return {...res, workout, meal};
};

export const AdminService = {
  dashboardOverView,
  userProgress,
};
