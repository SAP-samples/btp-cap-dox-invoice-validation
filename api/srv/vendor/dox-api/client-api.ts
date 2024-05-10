/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from "@sap-cloud-sdk/openapi";
import type { ClientPayload, PostClientPayload, PostClient, DeleteClientPayload, DeleteClient } from "./schema";
/**
 * Representation of the 'ClientApi'.
 * This API is part of the 'document_information_extraction_api' service.
 */
export const ClientApi = {
    /**
     * This endpoint returns all the client details as a list in the **`payload`** key in the returned JSON.
     * @param queryParameters - Object containing the following keys: clientIdStartsWith, offset, limit.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getClient: (queryParameters: { clientIdStartsWith?: string; offset?: number; limit: number }) =>
        new OpenApiRequestBuilder<ClientPayload>("get", "/clients", {
            queryParameters
        }),
    /**
     * This endpoint lets one create client(s) for whom documents can later be submitted for processing. The data for         each client must contain two fields - **`clientId`** and         **`clientName`** for each client. The field **`clientId`** should not be longer than 100 characters.
     * The list of clients should be sent as a JSON payload in the request.
     * ### Examples for payload parameter:
     * Single client: `{"value":[{"clientId":"c_00","clientName":"client 00"}]}`
     * Multiple clients: `{"value":[{"clientId":"c_00","clientName":"client 00"},         {"clientId":"c_01","clientName":"client 01"}]}`
     * ### Field values:
     * - The spaces at the beginning and the end of the value strings are removed.
     * @param body - Request body.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    postClient: (body: PostClientPayload) =>
        new OpenApiRequestBuilder<PostClient>("post", "/clients", {
            body
        }),
    /**
     * The endpoint lets one delete one or more client(s). It returns an error if any of the specified  client ids         do not exist.
     * @param body - Request body.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    deleteClient: (body: DeleteClientPayload) =>
        new OpenApiRequestBuilder<DeleteClient>("delete", "/clients", {
            body
        })
};
