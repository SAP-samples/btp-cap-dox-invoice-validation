/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Schema429TrialAccountQuotaExceededError' schema.
 */
export type Schema429TrialAccountQuotaExceededError =
    | {
          /**
           * @example "E102"
           */
          code?: string;
          /**
           * @example "Request exceeds trial account quotas."
           */
          message?: string;
          details?: string;
      }
    | Record<string, any>;
