/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from "@sap-cloud-sdk/openapi";
import type { Capabilities } from "./schema";
/**
 * Representation of the 'CapabilitiesApi'.
 * This API is part of the 'document_information_extraction_api' service.
 */
export const CapabilitiesApi = {
    /**
     * Retrieve the JSON consisting of lists of extractable fields, enrichment and document types that the service is
     * capable of processing.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getCapabilities: () => new OpenApiRequestBuilder<Capabilities>("get", "/capabilities")
};
