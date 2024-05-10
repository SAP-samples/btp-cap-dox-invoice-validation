/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from "@sap-cloud-sdk/openapi";
import type {
    GetData,
    DeleteDataPayload,
    DeleteDataResponse,
    DataPayload,
    PostDataResult,
    DeleteDataResult,
    GetDataJob
} from "./schema";
/**
 * Representation of the 'DataApi'.
 * This API is part of the 'document_information_extraction_api' service.
 */
export const DataApi = {
    /**
     * This endpoint returns a JSON response with the data entities.
     * If a single entity matches the query, the response will contain a entity in JSON, otherwise the
     * response will be a list.
     * @param queryParameters - Object containing the following keys: type, clientId, id, offset, limit, subtype, system, companyCode.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getData: (queryParameters: {
        type: "employee" | "businessEntity";
        clientId: string;
        id?: string;
        offset?: number;
        limit?: number;
        subtype?: "supplier" | "customer" | "companyCode";
        system?: string;
        companyCode?: string;
    }) =>
        new OpenApiRequestBuilder<GetData>("get", "/data", {
            queryParameters
        }),
    /**
     * It is recommended to use this endpoint for
     * relatively low amount of records and if the number of records is quite large the asynchronous delete
     * endpoint DELETE '/data/jobs' should be used.
     *
     * This endpoint allows the deletion of existing data for the specified fields.
     * It accepts an array of IDs that should be deleted in the payload. If no array is given, all entries will be
     * deleted.
     * @param body - Request body.
     * @param queryParameters - Object containing the following keys: type, clientId, subtype.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    deleteData: (
        body: DeleteDataPayload,
        queryParameters: {
            type: "employee" | "businessEntity";
            clientId: string;
            subtype?: "supplier" | "customer" | "companyCode";
        }
    ) =>
        new OpenApiRequestBuilder<DeleteDataResponse>("delete", "/data", {
            body,
            queryParameters
        }),
    /**
     * This endpoint allows the asynchronous creation and update of data for a specified client ID.
     *
     * The data can be submitted via the payload parameter that should contain a valid JSON string         which can be a list of multiple records of the same data type.
     *
     * The result of this endpoint will be the ID of the data persistence job responsible for uploading/updating
     * the data. This ID has to be used in the GET data endpoint to retrieve the current status of the data
     * persistence job.
     *
     * The two data types that can be submitted are:
     *
     * 1. **businessEntity** - Has subtype of supplier, customer, companyCode or unspecified.
     * 2. **employee** - Has no specified subtype.
     *
     * In the payload JSON string, a mandatory field of id must be provided for each data record for
     * businessEntity and employee.
     *
     * ### Examples for payload parameter:
     * **businessEntity**: `{"value": [{"id":"BE0001", "name":"","accountNumber":"", "address1":"", "address2": "",         "city":"", "countryCode":"", "postalCode":"","state":"", "email":"", "phone":"",         "bankAccount":"", "taxId":""}]}`
     *
     * **employee**: `{"value": [{"id":"E0001", "email":"", "firstName":"", "middleName": "", "lastName":""}]}`
     * @param body - Request body.
     * @param queryParameters - Object containing the following keys: type, clientId, subtype.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    postDataSave: (
        body: DataPayload,
        queryParameters: {
            type: "employee" | "businessEntity";
            clientId: string;
            subtype?: "supplier" | "customer" | "companyCode";
        }
    ) =>
        new OpenApiRequestBuilder<PostDataResult>("post", "/data/jobs", {
            body,
            queryParameters
        }),
    /**
     * In order to achieve a
     * better performance, this endpoint should be used to delete large amount of data records.
     *
     * It accepts an array of IDs that should be deleted in the payload. If no array is given, all entries will be
     * deleted.
     * @param body - Request body.
     * @param queryParameters - Object containing the following keys: type, clientId, subtype.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    deleteDataSave: (
        body: DeleteDataPayload,
        queryParameters: {
            type: "employee" | "businessEntity";
            clientId: string;
            subtype?: "supplier" | "customer" | "companyCode";
        }
    ) =>
        new OpenApiRequestBuilder<DeleteDataResult>("delete", "/data/jobs", {
            body,
            queryParameters
        }),
    /**
     * This endpoint will return a JSON with the status and processed time of the data persistence job specified by
     * the given ID
     * @param id - The ID returned by `[POST/DELETE]/data/jobs` endpoint. Example: 29812f26-464e-4ee6-be63-731859cf99f3
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getDataId: (id: string) =>
        new OpenApiRequestBuilder<GetDataJob>("get", "/data/jobs/{id}", {
            pathParameters: { id }
        })
};
