/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Employee } from "./employee";
/**
 * Representation of the 'DataPayload' schema.
 */
export type DataPayload =
    | {
          /**
           * @example [
           *   {
           *     "id": "E0001",
           *     "email": "jane.doe@company.com",
           *     "firstName": "Jane",
           *     "lastName": "Doe"
           *   },
           *   {
           *     "id": "E0002",
           *     "email": "john.bob.doe@company.com",
           *     "firstName": "John",
           *     "middleName": "Bob",
           *     "lastName": "Doe"
           *   },
           *   {
           *     "id": "E0003",
           *     "email": "jane.doe@company.com",
           *     "firstName": "Jane",
           *     "lastName": "Doe",
           *     "system": "system",
           *     "companyCode": "4711"
           *   }
           * ]
           */
          value?: Employee[];
      }
    | Record<string, any>;
