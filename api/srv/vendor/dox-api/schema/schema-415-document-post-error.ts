/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Schema415DocumentPostError' schema.
 */
export type Schema415DocumentPostError =
    | {
          /**
           * @example "E11"
           */
          code?: string;
          /**
           * @example "Error in parsing the document."
           */
          message?: string;
          details?: string;
      }
    | Record<string, any>;
