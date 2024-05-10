/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ClientPayload' schema.
 */
export type ClientPayload =
    | {
          /**
           * @example "1234"
           */
          id?: string;
          /**
           * @example [
           *   {
           *     "clientId": "c_00",
           *     "clientName": "client 00"
           *   },
           *   {
           *     "clientId": "c_01",
           *     "clientName": "client 01"
           *   },
           *   {
           *     "clientId": "c_02",
           *     "clientName": "client 02"
           *   },
           *   {
           *     "clientId": "c_03",
           *     "clientName": "client 03"
           *   },
           *   {
           *     "clientId": "c_04",
           *     "clientName": "client 04"
           *   }
           * ]
           */
          payload?: Record<string, any>[];
      }
    | Record<string, any>;
