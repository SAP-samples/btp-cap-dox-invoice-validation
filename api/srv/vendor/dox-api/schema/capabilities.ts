/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Capabilities' schema.
 */
export type Capabilities =
    | {
          /**
           * Extractable fields along with associated datatypes
           */
          extraction?: Record<string, any>;
          /**
           * Document types which can be processed using Document Information Extraction service
           * @example [
           *   "invoice",
           *   "paymentAdvice",
           *   "purchaseOrder",
           *   "coeTestDocument"
           * ]
           */
          documentTypes?: string[];
          /**
           * Fields extracted from various types of documents along with supported documents for each field
           */
          enrichment?: Record<string, any>;
      }
    | Record<string, any>;
