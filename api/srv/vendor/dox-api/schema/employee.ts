/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Employee' schema.
 */
export type Employee =
    | {
          /**
           * @example "E0001"
           * Max Length: 128.
           */
          id?: string;
          /**
           * @example "foo@bar.com"
           * Max Length: 100.
           */
          email?: string;
          /**
           * @example "Foo"
           * Max Length: 100.
           */
          firstName?: string;
          /**
           * @example "M."
           * Max Length: 100.
           */
          middleName?: string;
          /**
           * @example "Bar"
           * Max Length: 100.
           */
          lastName?: string;
          /**
           * @example "system"
           * Max Length: 10.
           */
          system?: string;
          /**
           * @example "4711"
           * Max Length: 4.
           */
          companyCode?: string;
      }
    | Record<string, any>;
