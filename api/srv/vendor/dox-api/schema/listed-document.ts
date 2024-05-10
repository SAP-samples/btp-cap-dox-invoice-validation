/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ListedDocument' schema.
 */
export type ListedDocument =
    | {
          /**
           * @example "DONE"
           */
          status?: string;
          /**
           * @example "c1673dee-56d6-4960-9a36-c29529f04b4a"
           */
          id?: string;
          /**
           * @example "invoice.pdf"
           */
          fileName?: string;
          /**
           * @example "invoice"
           */
          documentType?: string;
          /**
           * Format: "date".
           */
          created?: string;
          /**
           * Format: "date".
           */
          finished?: string;
          /**
           * @example "c1"
           */
          clientId?: string;
      }
    | Record<string, any>;
