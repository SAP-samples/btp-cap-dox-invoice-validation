/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from "@sap-cloud-sdk/openapi";
import type {
    GetDocumentsResult,
    DocumentStatus,
    DeleteDocuments,
    DeleteAllDocumentsStatusMessage,
    GetDocumentResult,
    PostDocumentGroundTruth,
    DocumentCreatedId,
    DocumentConfirmedId,
    PagesText,
    PageText,
    DocumentOptions
} from "./schema";
/**
 * Representation of the 'DocumentApi'.
 * This API is part of the 'document_information_extraction_api' service.
 */
export const DocumentApi = {
    /**
     * Returns a list of documents as JSON.
     * Optional clientId can be set for filtering based on client.
     * @param queryParameters - Object containing the following keys: clientId.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getDocument: (queryParameters?: { clientId?: string }) =>
        new OpenApiRequestBuilder<GetDocumentsResult>("get", "/document/jobs", {
            queryParameters
        }),
    /**
     * This asynchronous endpoint lets the client submit a **pdf** document for processing. If the document gets         submitted successfully, a ID is returned. This **ID** can be used at other endpoints         like **`[GET]/document/jobs/{id}`** and **`[DELETE]/document/jobs/{id}`**.
     * @param body - Request body.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    postDocument: (body: any) =>
        new OpenApiRequestBuilder<DocumentStatus>("post", "/document/jobs", {
            body
        }),
    /**
     * Delete a list of documents or all documents. The payload is an optional array of IDs that should be deleted.
     * If the parameter is not present, all documents will be deleted
     * @param body - Request body.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    deleteDocument: (body: DeleteDocuments) =>
        new OpenApiRequestBuilder<DeleteAllDocumentsStatusMessage>("delete", "/document/jobs", {
            body
        }),
    /**
     * Receives the ID of a document submitted previously and returns the corresponding processing result,         or an error if no result for the given id was found. In case there are no values found for requested fields in         header or line items, they are omitted from the processing result (no null values)
     * @param id - The ID returned when a document is submitted via **`[POST]/document/jobs`** endpoint. Example: 4476cc01-72f3-4b64-9eb0-cdd9c1cb27ff
     * @param queryParameters - Object containing the following keys: returnNullValues, extractedValues.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getDocumentId: (id: string, queryParameters?: { returnNullValues?: boolean; extractedValues?: boolean }) =>
        new OpenApiRequestBuilder<GetDocumentResult>("get", "/document/jobs/{id}", {
            pathParameters: { id },
            queryParameters
        }),
    /**
     * Create a request builder for execution of post requests to the '/document/jobs/{id}' endpoint.
     * @param id - The ID returned when a document is submitted via **`[POST]/document/jobs`** endpoint. Example: 4476cc01-72f3-4b64-9eb0-cdd9c1cb27ff
     * @param body - Request body.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    postDocumentId: (id: string, body: PostDocumentGroundTruth) =>
        new OpenApiRequestBuilder<DocumentCreatedId>("post", "/document/jobs/{id}", {
            pathParameters: { id },
            body
        }),
    /**
     * Create a request builder for execution of post requests to the '/document/jobs/{id}/confirm' endpoint.
     * @param id - ID to identify the document
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    postDocumentConfirm: (id: string) =>
        new OpenApiRequestBuilder<DocumentConfirmedId>("post", "/document/jobs/{id}/confirm", {
            pathParameters: { id }
        }),
    /**
     * Create a request builder for execution of get requests to the '/document/jobs/{id}/pages/text' endpoint.
     * @param id - ID to identify the document
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getDocumentPagesText: (id: string) =>
        new OpenApiRequestBuilder<PagesText>("get", "/document/jobs/{id}/pages/text", {
            pathParameters: { id }
        }),
    /**
     * Create a request builder for execution of get requests to the '/document/jobs/{id}/pages/{no}/text' endpoint.
     * @param id - ID to identify the document
     * @param no - The page number of the document (int)
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getDocumentPageText: (id: string, no: string) =>
        new OpenApiRequestBuilder<PageText>("get", "/document/jobs/{id}/pages/{no}/text", {
            pathParameters: { id, no }
        }),
    /**
     * Create a request builder for execution of get requests to the '/document/jobs/{id}/request' endpoint.
     * @param id - ID to identify the document
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getDocumentRequest: (id: string) =>
        new OpenApiRequestBuilder<DocumentOptions>("get", "/document/jobs/{id}/request", {
            pathParameters: { id }
        })
};
