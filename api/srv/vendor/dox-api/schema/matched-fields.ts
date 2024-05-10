/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MatchedSender } from "./matched-sender";
import type { MatchedEmployee } from "./matched-employee";
/**
 * Representation of the 'MatchedFields' schema.
 */
export type MatchedFields =
    | {
          sender?: MatchedSender[];
          employee?: MatchedEmployee[];
      }
    | Record<string, any>;
