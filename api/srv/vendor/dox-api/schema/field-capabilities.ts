/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SingleFieldCapabilities } from "./single-field-capabilities";
/**
 * Representation of the 'FieldCapabilities' schema.
 */
export type FieldCapabilities =
    | {
          /**
           * @example [
           *   {
           *     "name": "documentNumber",
           *     "type": "string"
           *   },
           *   {
           *     "name": "taxId",
           *     "type": "string"
           *   },
           *   {
           *     "name": "...",
           *     "type": "type"
           *   }
           * ]
           */
          headerFields?: SingleFieldCapabilities[];
          /**
           * @example [
           *   {
           *     "name": "description",
           *     "type": "string"
           *   },
           *   {
           *     "name": "netAmount",
           *     "type": "number"
           *   },
           *   {
           *     "name": "purchaseOrderNumber",
           *     "type": "string"
           *   },
           *   {
           *     "name": "quantity",
           *     "type": "number"
           *   },
           *   {
           *     "name": "...",
           *     "type": "type"
           *   }
           * ]
           */
          lineItemFields?: SingleFieldCapabilities[];
      }
    | Record<string, any>;
