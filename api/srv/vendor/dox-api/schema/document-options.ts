/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DocumentOptions' schema.
 */
export type DocumentOptions =
    | {
          /**
           * @example "..."
           */
          extraction?: string;
          /**
           * @example "c_00"
           */
          clientId?: string;
          /**
           * @example "invoice"
           */
          documentType?: string;
          /**
           * @example "2023-08-15T11:56:09.444Z"
           */
          receivedDate?: string;
      }
    | Record<string, any>;
