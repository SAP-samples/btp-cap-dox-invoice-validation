/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'GetData' schema.
 */
export type GetData =
    | {
          /**
           * @example [
           *   {
           *     "id": "BE0001",
           *     "name": "A",
           *     "accountNumber": "12345",
           *     "address1": "A street 5",
           *     "address2": "",
           *     "city": "Heidelberg",
           *     "countryCode": "DE",
           *     "postalCode": "69117",
           *     "state": "BW",
           *     "email": "a@a.com",
           *     "phone": "",
           *     "bankAccount": "000001",
           *     "taxId": "999",
           *     "companyCode": "4711",
           *     "system": "System A"
           *   }
           * ]
           */
          value?: string[];
      }
    | Record<string, any>;
