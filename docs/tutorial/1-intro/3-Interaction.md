## Application Interaction

This section provides an in-depth explanation of how the **SAP Cloud Application Programming Model (CAP)** backend interacts with the different services on the **SAP Business Technology Platform (SAP BTP)**, focusing especially on the **SAP Document Information Extraction (DOX)** Service.

[<img src="images\Solution_Diagram_interaction_new_cache.drawio.png" width="1200"/>](images/Solution_Diagram_interaction_new_cache.drawio.png)
_**Picture:** Sequence Interactions of Invoice Validation_

As illustrated in the picture above, the application's core purpose is to validate invoices received via e-mail or physical mail - scanned into a PDF format file. The invoices are stored via the **BTP Object Store** Service in an arbitrary object store, e.g. **Amazon S3 Object Store**, ensuring that a persistent version of each invoice is available.

The **Sequence of Interactions** looks like:

1. The **SAP Cloud Application Programming Model (CAP)** backend fetches the invoices from the **BTP Object Store** Service, marking the beginning of the sequence of interactions.
2. After being fetched, each invoice is uploaded to the **SAP Document Information Extraction (DOX)** Service. With its powerful API, the service leverages **Generative Artificial Intelligence (GenAI)** to extract structured and meaningful data from documents such as invoices, going far beyond typical **Optical Character Recognition (OCR)** scanned text documents.
3. The **SAP Document Information Extraction (DOX)** Service processes the invoice and returns a unique job ID along with a status code indicating that the extraction is in progress.
4. The **SAP Document Information Extraction (DOX)** Service' job ID is stored in the **SAP HANA Cloud** Database. This database holds all invoice related information, including the job IDs, metadata of the invoices, and invoice correction data, thereby enabling retrieval of document extraction later on.
5. Once an invoice has been processed, it is available for use in the front-end, which then calls the **SAP Cloud Application Programming Model (CAP)** backend on demand to get the invoice information extraction results.
6. The backend then requests the job ID from the **SAP HANA Cloud** Database using the invoice ID.
7. With the job ID of the invoice the backend then requests the invoice information extraction data from the **SAP Document Information Extraction (DOX)** Service.
8. The **SAP Document Information Extraction (DOX)** Service returns the invoice information extraction in a structured JSON format.
9. The extracted invoice information is sent back to the application front end.

The extractions then populate invoice values in the UI, enhancing the user experience during invoice validation. If the extraction is not finished, the invoice appears greyed out, indicating it's not ready yet for validation.
