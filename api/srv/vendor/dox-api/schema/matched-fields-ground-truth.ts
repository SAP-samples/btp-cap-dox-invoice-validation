/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MatchedSender } from "./matched-sender";
import type { MatchedEmployee } from "./matched-employee";
/**
 * Representation of the 'MatchedFieldsGroundTruth' schema.
 */
export type MatchedFieldsGroundTruth =
    | {
          /**
           * Max Items: 1.
           */
          sender?: MatchedSender[];
          /**
           * Max Items: 1.
           */
          employee?: MatchedEmployee[];
      }
    | Record<string, any>;
