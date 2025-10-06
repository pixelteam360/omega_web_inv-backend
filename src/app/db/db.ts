import { PlanType, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../config";

export const initiateSuperAdmin = async () => {
  const hashedPassword = await bcrypt.hash(
    "123456789",
    Number(config.bcrypt_salt_rounds)
  );
  const payload: any = {
    email: "homerd@alphapulsefit.com",
    phone: "123456789",
    birth: "2000-06-09T12:00:00Z",
    activePlan: true,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const nPayload: any = {
    email: "nutritionist@gmail.com",
    phone: "123456789",
    birth: "2000-06-09T12:00:00Z",
    activePlan: true,
    password: hashedPassword,
    role: UserRole.NUTRITION,
  };

  const isAdminExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
      role: "ADMIN",
    },
  });

  const isNExists = await prisma.user.findUnique({
    where: {
      email: nPayload.email,
      role: "NUTRITION",
    },
  });

  if (!isAdminExists) {
    await prisma.user.create({
      data: payload,
    });
  } else if (!isNExists) {
    await prisma.user.create({
      data: nPayload,
    });
  } else {
    return;
  }
};

export const initiateSubscriptionPlan = async () => {
  const isExistPlan = await prisma.plan.findMany();

  if (isExistPlan.length > 0) return;

  const defaultPlan = [
    {
      title: "Monthly Plan",
      duration: 30,
      price: 12.99,
      type: PlanType.MONTHLY,
      features: [
        "Unlimited access to all workouts and meal plans",
        "Messaging and full community interaction",
        "A 25% discount on vitamins and supplements at Alphaomegavitality.com",
      ],
    },
    {
      title: "Yearly Plan",
      duration: 365,
      price: 89.99,
      type: PlanType.YEARLY,
      features: [
        "Offering over 40% savings",
        "Unlimited access to all workouts and meal plans",
        "Messaging and full community interaction",
        "A 25% discount on vitamins and supplements at Alphaomegavitality.com",
      ],
    },
  ];

  await prisma.plan.createMany({
    data: defaultPlan,
  });
};
