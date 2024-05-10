/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BadRequestNoFileUploadedError' schema.
 */
export type BadRequestNoFileUploadedError =
    | {
          /**
           * @example "E92"
           */
          code?: string;
          /**
           * @example "No file was uploaded for processing."
           */
          message?: string;
          details?: string;
      }
    | Record<string, any>;
