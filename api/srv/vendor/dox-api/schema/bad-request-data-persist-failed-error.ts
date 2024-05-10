/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BadRequestDataPersistFailedError' schema.
 */
export type BadRequestDataPersistFailedError =
    | {
          /**
           * @example "E53"
           */
          code?: string;
          /**
           * @example "Failed to persist data."
           */
          message?: string;
          details?: string;
      }
    | Record<string, any>;
