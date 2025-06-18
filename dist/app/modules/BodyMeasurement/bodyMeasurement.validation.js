"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyMeasurementValidation = exports.UnitEnum = void 0;
const zod_1 = require("zod");
exports.UnitEnum = zod_1.z.enum(["CM", "IN", "KG", "LB"]);
const BodyMeasurementValidationSchema = zod_1.z.object({
    unit: exports.UnitEnum,
    startingChest: zod_1.z.number().int(),
    presentChest: zod_1.z.number().int(),
    startingWaist: zod_1.z.number().int(),
    presentWaist: zod_1.z.number().int(),
    startingHips: zod_1.z.number().int(),
    presentHips: zod_1.z.number().int(),
    startingArms: zod_1.z.number().int(),
    presentArms: zod_1.z.number().int(),
    weight: zod_1.z.number(),
});
const BodyMeasurementUpdateSchema = zod_1.z.object({
    unit: exports.UnitEnum.optional(),
    startingChest: zod_1.z.number().int().optional(),
    presentChest: zod_1.z.number().int().optional(),
    startingWaist: zod_1.z.number().int().optional(),
    presentWaist: zod_1.z.number().int().optional(),
    startingHips: zod_1.z.number().int().optional(),
    presentHips: zod_1.z.number().int().optional(),
    startingArms: zod_1.z.number().int().optional(),
    presentArms: zod_1.z.number().int().optional(),
    weight: zod_1.z.number().optional(),
});
exports.BodyMeasurementValidation = {
    BodyMeasurementValidationSchema,
    BodyMeasurementUpdateSchema,
};
