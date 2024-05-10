/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BadRequestInvalidJsonError' schema.
 */
export type BadRequestInvalidJsonError =
    | {
          /**
           * @example "E56"
           */
          code?: string;
          /**
           * @example "Invalid JSON found in the request."
           */
          message?: string;
          details?: string;
      }
    | Record<string, any>;
