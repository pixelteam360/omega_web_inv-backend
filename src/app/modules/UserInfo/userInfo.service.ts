import prisma from "../../../shared/prisma";
import { UserInfo } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { TUserInfo } from "./userInfo.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createUserInfoIntoDb = async (
  payload: TUserInfo,
  userId: string,
  imageFile: any
) => {
  const userInfo = await prisma.userInfo.findFirst({
    where: { userId },
  });

  if (userInfo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already submited you info"
    );
  }

  let image = "";
  if (imageFile) {
    image = (await fileUploader.uploadToDigitalOcean(imageFile)).Location;
  }

  const result = await prisma.userInfo.create({
    data: { ...payload, userId, image },
  });

  return result;
};

const getMyUserInfo = async (id: string) => {
  const result = await prisma.userInfo.findFirst({
    where: { userId: id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return result;
};

const updateUserInfo = async (
  payload: UserInfo,
  imageFile: any,
  userId: string
) => {
  const userInfo = await prisma.userInfo.findFirst({
    where: { userId },
  });

  const result = await prisma.$transaction(async (prisma) => {
    let image = userInfo?.image;
    if (imageFile) {
      image = (await fileUploader.uploadToDigitalOcean(imageFile)).Location;
    }

    const updateUserInfoProfile = await prisma.userInfo.update({
      where: { id: userInfo?.id },
      data: { ...payload, image: image },
    });

    return updateUserInfoProfile;
  });

  return result;
};

export const UserInfoService = {
  createUserInfoIntoDb,
  getMyUserInfo,
  updateUserInfo,
};
