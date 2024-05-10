/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentHeaderField } from "./document-header-field";
import type { DocumentLineitem } from "./document-lineitem";
/**
 * Representation of the 'DocumentExtraction' schema.
 */
export type DocumentExtraction =
    | {
          /**
           * Header fields of a document
           * @example [
           *   {
           *     "name": "documentDate",
           *     "value": "2023-08-15T11:56:09.443Z",
           *     "confidence": 0.995591627226936,
           *     "page": 1,
           *     "coordinates": {
           *       "x": 0.700392156862745,
           *       "y": 0.0875757575757576,
           *       "w": 0.084313725490196,
           *       "h": 0.00878787878787879
           *     }
           *   },
           *   {
           *     "name": "grossAmount",
           *     "value": 200,
           *     "confidence": 0.996594140926997,
           *     "page": 1,
           *     "coordinates": {
           *       "x": 0.892156862745098,
           *       "y": 0.836060606060606,
           *       "w": 0.0490196078431372,
           *       "h": 0.00878787878787879
           *     }
           *   }
           * ]
           */
          headerFields?: DocumentHeaderField[];
          /**
           * Lineitems of a document
           * @example [
           *   [
           *     {
           *       "name": "description",
           *       "value": "Professional Services",
           *       "confidence": 0,
           *       "page": 1,
           *       "coordinates": {
           *         "x": 0.29921568627451,
           *         "y": 0.655151515151515,
           *         "w": 0.0729411764705882,
           *         "h": 0.00909090909090904
           *       }
           *     },
           *     {
           *       "name": "netAmount",
           *       "value": 200,
           *       "confidence": 0,
           *       "page": 1,
           *       "coordinates": {
           *         "x": 0.867058823529412,
           *         "y": 0.655151515151515,
           *         "w": 0.0729411764705882,
           *         "h": 0.00909090909090904
           *       }
           *     },
           *     {
           *       "name": "unitPrice",
           *       "value": 200,
           *       "confidence": 0,
           *       "page": 1,
           *       "coordinates": {
           *         "x": 0.686666666666667,
           *         "y": 0.655151515151515,
           *         "w": 0.0309803921568628,
           *         "h": 0.00878787878787879
           *       }
           *     },
           *     {
           *       "name": "materialNumber",
           *       "value": "007",
           *       "confidence": 0,
           *       "page": 1,
           *       "coordinates": {
           *         "x": 0.330588235294118,
           *         "y": 0.655151515151515,
           *         "w": 0.205490196078431,
           *         "h": 0.0106060606060606
           *       }
           *     }
           *   ]
           * ]
           */
          lineItems?: DocumentLineitem[];
      }
    | Record<string, any>;
