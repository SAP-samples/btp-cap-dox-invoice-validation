/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DocumentLineitem' schema.
 */
export type DocumentLineitem =
    | {
          /**
           * Max Length: 30.
           */
          name?: string;
          value?: string;
          confidence?: number;
          page?: number;
          /**
           * @example {
           *   "x": 0.501960784313725,
           *   "y": 0.341212121212121,
           *   "w": 0.0870588235294118,
           *   "h": 0.00878787878787879
           * }
           */
          coordinates?: Record<string, any>;
      }
    | Record<string, any>;
