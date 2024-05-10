/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BadRequestInvalidParamError' schema.
 */
export type BadRequestInvalidParamError =
    | {
          /**
           * @example "E52"
           */
          code?: string;
          /**
           * @example "The parameter needs to be an integer."
           */
          message?: string;
          details?: string;
      }
    | Record<string, any>;
