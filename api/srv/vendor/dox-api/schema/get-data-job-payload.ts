/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'GetDataJobPayload' schema.
 */
export type GetDataJobPayload =
    | {
          /**
           * @example "484b6e1c-501c-4a07-85cb-84554656a175"
           */
          id?: string;
          /**
           * @example "DONE"
           */
          status?: string;
          /**
           * @example "2023-08-15T11:56:09.444Z"
           */
          processedTime?: string;
      }
    | Record<string, any>;
