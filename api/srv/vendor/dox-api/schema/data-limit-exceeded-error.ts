/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DataLimitExceededError' schema.
 */
export type DataLimitExceededError =
    | {
          /**
           * @example "E87"
           */
          code?: string;
          /**
           * @example "Limit per request is exceeded."
           */
          message?: string;
          details?: string;
      }
    | Record<string, any>;
