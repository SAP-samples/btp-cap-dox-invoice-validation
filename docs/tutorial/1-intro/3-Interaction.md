## Application Interaction

This section provides an in-depth explanation of how the **SAP Cloud Application Programming Model (CAP)** backend interacts with the different services on the **SAP Business Technology Platform (SAP BTP)**, focusing especially on the **SAP Document Information Extraction (DOX)** Service.

As illustrated in the picture above, the application's core purpose is to validate invoices received via e-mail or physical mail - scanned into a PDF format file. The invoices are stored via the **BTP Object Store** Service in an arbitrary object store, e.g. **Amazon S3 Object Store**, ensuring that a persistent version of each invoice is available.

The **Sequence of Interactions** looks like:

1. The **SAP Cloud Application Programming Model (CAP)** backend fetches the invoices from the **BTP Object Store** Service, marking the beginning of the sequence of interactions.
2. After being fetched, each invoice is uploaded to the **SAP Document Information Extraction (DOX)** Service. With its powerful API, the service leverages **Generative Artificial Intelligence (GenAI)** to extract structured and meaningful data from documents such as invoices, going far beyond typical **Optical Character Recognition (OCR)** scanned text documents.
3. The **SAP Document Information Extraction (DOX)** Service processes the invoice and returns a unique job ID along with a status code indicating that the extraction is in progress. At this point, the backend initiates a periodic interval to check the processing status every 10 seconds for up to 3 minutes.
4. The **SAP Document Information Extraction (DOX)** Service job ID is stored in the **SAP HANA Cloud** Database. This database holds all invoice related information, including the job IDs, metadata of the invoices, and invoice correction data, thereby enabling retrieval of document extraction later on.
5. Once the invoice is processed, the job ID is retrieved from the **SAP HANA Cloud** Database.
6. The backend then requests the extraction data from the **SAP Document Information Extraction (DOX)** Service using the job ID.
7. When the invoice information extraction is complete, the **SAP Document Information Extraction (DOX)** Service returns the result in a structured JSON format.
8. The backend stores the invoice information extractions in the **BTP Object Store** Service.
9. When a user accesses the application front end (**UI5 Web Components for React**), it fetches the extraction data of a specific invoice from the backend.
10. The stored invoice information extractions are retrieved from the **BTP Object Store** Service.
11. The extracted invoice information is sent back to the application front end.

This data **???** then populates invoice values in the UI, enhancing the user experience during invoice validation. If the extraction is not finished, the invoice appears greyed out, indicating it's not ready for validation.

[<img src="images\Solution_Diagram_Interaction_new_cache.drawio.png" width="1200"/>](images/Solution_Diagram_Interaction_new_cache.drawio.png)
_**Picture:** Sequence Interactions of Invoice Validation_