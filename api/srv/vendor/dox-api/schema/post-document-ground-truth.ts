/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentExtraction } from "./document-extraction";
import type { MatchedFieldsGroundTruth } from "./matched-fields-ground-truth";
/**
 * Representation of the 'PostDocumentGroundTruth' schema.
 */
export type PostDocumentGroundTruth =
    | {
          /**
           * @example "DONE"
           */
          status?: string;
          /**
           * @example "4476cc01-72f3-4b64-9eb0-cdd9c1cb27ff"
           */
          id?: string;
          /**
           * @example "invoice1-pdf"
           * Max Length: 255.
           */
          fileName?: string;
          /**
           * @example "invoice"
           * Max Length: 20.
           */
          documentType?: string;
          created?: string;
          finished?: string;
          languages?: string;
          /**
           * Max Length: 5.
           */
          country?: string;
          receivedDate?: string;
          extraction?: DocumentExtraction;
          enrichment?: MatchedFieldsGroundTruth;
      }
    | Record<string, any>;
