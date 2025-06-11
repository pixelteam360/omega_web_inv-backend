import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TBodyMeasurement } from "./bodyMeasurement.interface";

const createBodyMeasurementIntoDb = async (
  payload: TBodyMeasurement,
  userId: string
) => {
  const measurement = await prisma.bodyMeasurement.findFirst({
    where: { userId },
  });

  if (measurement) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already created Body Measurement"
    );
  }

  const { weight, ...rest } = payload;
  const result = await prisma.$transaction(async (prisma) => {
    const result = await prisma.bodyMeasurement.create({
      data: { ...rest, userId },
    });

    await prisma.weightProgress.create({
      data: { weight, userId },
    });

    return result;
  });

  return result;
};

const getBodyMeasurementsFromDb = async () => {
  const result = await prisma.bodyMeasurement.findMany();
  return {
    data: result,
  };
};

const getSingleBodyMeasurement = async (id: string) => {
  const result = await prisma.bodyMeasurement.findFirst({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }
  return result;
};

const updateBodyMeasurement = async (
  payload: Partial<TBodyMeasurement>,
  userId: string
) => {
  const measurement = await prisma.bodyMeasurement.findFirst({
    where: { userId },
  });

  if (!measurement) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Body Measurement not found");
  }

  const { weight, unit, ...rest } = payload;

  const lastWeight = await prisma.weightProgress.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const currentDate = new Date();

  const isSameDay =
    lastWeight?.createdAt &&
    lastWeight.createdAt.toDateString() === currentDate.toDateString();

  const result = await prisma.$transaction(async (prisma) => {
    const bodyMeasurement = await prisma.bodyMeasurement.update({
      where: { id: measurement.id },
      data: { ...rest },
    });

    if (weight && !isSameDay) {
      await prisma.weightProgress.create({
        data: { weight, userId },
      });
    } else if (weight && isSameDay) {
      await prisma.weightProgress.update({
        where: { id: lastWeight?.id },
        data: { weight },
      });
    }

    return bodyMeasurement;
  });

  return result;
};

export const BodyMeasurementService = {
  createBodyMeasurementIntoDb,
  getBodyMeasurementsFromDb,
  getSingleBodyMeasurement,
  updateBodyMeasurement,
};
