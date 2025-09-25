import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NutritionService } from "./nutrition.service";
import pick from "../../../shared/pick";
import { nutritionFilterableFields } from "./nutrition.costant";

const createNutrition = catchAsync(async (req, res) => {
  const result = await NutritionService.createNutritionIntoDb(
    req.body,
    req.files
  );
  sendResponse(res, {
    message: "Nutrition created successfully!",
    data: result,
  });
});

const getNutritions = catchAsync(async (req, res) => {
  const filters = pick(req.query, nutritionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await NutritionService.getNutritionsFromDb(filters, options);
  sendResponse(res, {
    message: "Nutrition retrieved successfully!",
    data: result,
  });
});

const getSingleNutrition = catchAsync(async (req, res) => {
  const result = await NutritionService.getSingleNutrition(req.params.id);
  sendResponse(res, {
    message: "Nutrition retrieved successfully",
    data: result,
  });
});

const updateNutrition = catchAsync(async (req, res) => {
  const files = req.files as any;

  const iconFile =
    Array.isArray(files?.icon) && files.icon.length > 0
      ? files.icon[0]
      : undefined;

  const nutritionTipsFile =
    Array.isArray(files?.nutritionTips) && files.nutritionTips.length > 0
      ? files.nutritionTips[0]
      : undefined;

  const result = await NutritionService.updateNutrition(
    req.body,
    req.params.id,
    iconFile,
    nutritionTipsFile
  );
  sendResponse(res, {
    message: "Nutrition updated successfully!",
    data: result,
  });
});

const deleteNutrition = catchAsync(async (req, res) => {
  const result = await NutritionService.deleteNutrition(req.params.id);
  sendResponse(res, {
    message: "Nutrition deleted successfully",
    data: result,
  });
});

const edamamData = catchAsync(async (req, res) => {
  const result = await NutritionService.edamamData();
  sendResponse(res, {
    message: "Edamam data retrieved successfully",
    data: result,
  });
});

export const NutritionController = {
  createNutrition,
  getNutritions,
  getSingleNutrition,
  updateNutrition,
  deleteNutrition,
  edamamData,
};
