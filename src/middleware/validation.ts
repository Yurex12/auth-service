import type { RequestHandler } from 'express';
import { z, type ZodType } from 'zod';

const validate = (
  schema: ZodType,
  source: 'body' | 'params' | 'query',
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const result = await schema.parseAsync(req[source]);

      req[source] = result;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: `Invalid ${source}`,
          errors: z.flattenError(error).fieldErrors,
        });
        return;
      }

      next(error);
    }
  };
};

const validateRequestBody = (schema: ZodType): RequestHandler =>
  validate(schema, 'body');

const validateRequestParams = (schema: ZodType): RequestHandler =>
  validate(schema, 'params');

const validateRequestQuery = (schema: ZodType): RequestHandler =>
  validate(schema, 'query');

export { validateRequestBody, validateRequestParams, validateRequestQuery };
