/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BadRequestDataDeleteFailedError' schema.
 */
export type BadRequestDataDeleteFailedError =
    | {
          /**
           * @example "E51"
           */
          code?: string;
          /**
           * @example "Failed to delete data."
           */
          message?: string;
          details?: string;
      }
    | Record<string, any>;
