/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DeleteAllDocumentsStatusMessage' schema.
 */
export type DeleteAllDocumentsStatusMessage =
    | {
          /**
           * @example "DONE"
           */
          status?: string;
          /**
           * @example "Documents deleted successfully."
           */
          message?: string;
          /**
           * Format: "date".
           */
          processedTime?: string;
      }
    | Record<string, any>;
