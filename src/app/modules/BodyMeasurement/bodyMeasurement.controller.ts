import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BodyMeasurementService } from "./bodyMeasurement.service";

const createBodyMeasurement = catchAsync(async (req, res) => {
  const result = await BodyMeasurementService.createBodyMeasurementIntoDb(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "BodyMeasurement created successfully!",
    data: result,
  });
});

const getBodyMeasurements = catchAsync(async (req, res) => {
  const result = await BodyMeasurementService.getBodyMeasurementsFromDb();
  sendResponse(res, {
    message: "BodyMeasurements retrieve successfully!",
    data: result,
  });
});

const getSingleBodyMeasurement = catchAsync(async (req, res) => {
  const result = await BodyMeasurementService.getSingleBodyMeasurement(
    req.params.id
  );
  sendResponse(res, {
    message: "BodyMeasurement retrieved successfully",
    data: result,
  });
});

const updateBodyMeasurement = catchAsync(async (req, res) => {
  const result = await BodyMeasurementService.updateBodyMeasurement(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "BodyMeasurement updated successfully!",
    data: result,
  });
});

export const BodyMeasurementController = {
  createBodyMeasurement,
  getBodyMeasurements,
  getSingleBodyMeasurement,
  updateBodyMeasurement,
};
