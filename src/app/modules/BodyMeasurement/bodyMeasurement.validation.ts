import { z } from "zod";

export const UnitEnum = z.enum(["CM", "IN", "KG", "LB"]);

const BodyMeasurementValidationSchema = z.object({
  unit: UnitEnum,
  startingChest: z.number().int(),
  presentChest: z.number().int(),
  startingWaist: z.number().int(),
  presentWaist: z.number().int(),
  startingHips: z.number().int(),
  presentHips: z.number().int(),
  startingArms: z.number().int(),
  presentArms: z.number().int(),
  weight: z.number(),
});

const BodyMeasurementUpdateSchema = z.object({
  unit: UnitEnum.optional(),
  startingChest: z.number().int().optional(),
  presentChest: z.number().int().optional(),
  startingWaist: z.number().int().optional(),
  presentWaist: z.number().int().optional(),
  startingHips: z.number().int().optional(),
  presentHips: z.number().int().optional(),
  startingArms: z.number().int().optional(),
  presentArms: z.number().int().optional(),
  weight: z.number().optional(),
});

export const BodyMeasurementValidation = {
  BodyMeasurementValidationSchema,
  BodyMeasurementUpdateSchema,
};
