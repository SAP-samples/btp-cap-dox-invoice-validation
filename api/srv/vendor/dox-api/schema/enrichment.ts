/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SingleEnrichmentCapabilities } from "./single-enrichment-capabilities";
/**
 * Representation of the 'Enrichment' schema.
 */
export type Enrichment =
    | {
          /**
           * @example [
           *   {
           *     "dataTypes": "businessEntity"
           *   }
           * ]
           */
          sender?: SingleEnrichmentCapabilities[];
          "..."?: SingleEnrichmentCapabilities[];
      }
    | Record<string, any>;
