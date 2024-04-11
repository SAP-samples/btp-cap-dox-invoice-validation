# Scenario

This part of the tutorial offers a comprehensive overview of the scenario addressed in this step-by-step guide, along with key technical highlights of our sample scenario.

## Introduction

For multiple invoice types (e.g. construction invoices) the invoice check / validation is a very complex process which could often need additional domain expertise and possibly different personas - like external domain experts. The provided **Invoice Validation** sample scenario on **SAP Business Technology Platform (SAP BTP)** is designed to exactly fulfil these needs.

The application enables to do extensive and complex invoice validation outside **SAP S/4HANA Cloud (Private Edition / Public Edition)** on SAP Business Technology Platform for experienced domain experts in a proper and reliable workflow. It could replace the current process which is manual, error prone and not transparent to all stakeholders, like the accounting team members responsible for payments and all external validators. Due to the **SAP Document Information Extraction (DOX) Service** assistance behind the scenes is in place, the validation work is simplified. This scenario could be connected upstream of **SAP Central Invoice Management (CIM)** or **OpenText Vendor Invoice Management (VIM)** or other comparable solutions to complete the payment process afterwards.

The simplified **Process Flow** looks like:

[<img src="images\Process_Flow.png" width="1200"/>](images\Process_Flow.png?raw=true)

The main **Process Steps** are:

1. The invoice arrives via email as PDF attachment or via postal letter, which will be scanned into PDF format.
2. The PDF invoice will be preprocessed by Document Information Extraction (DOX) Service.
3. The Invoice will be dispatched to correct processor and afterwards validated by an Accounting Team Member. In case of additional expert domain knowledge is necessary, then the invoice could be forwarded to an Internal or External Validator.
4. The Internal or External Validator is doing an detailed invoice check, e.g. doing position corrections, deductions and retentions. After he finished his work he sends back the invoice to Accounting team member.
5. The Accounting Team Member is doing a last double check and forwards the validated invoice to SAP Central Invoice Management (CIM) or OpenText Vendor Invoice Management (VIM).

The simplified **Solution Diagram** looks like:

[<img src="images\Solution_Diagram.png" width="1200"/>](images\Solution_Diagram.png?raw=true)

## Application Interaction

This section provides an in-depth explanation of how the invoice validation application's **SAP Cloud Application Programming Model (CAP)** backend interacts with the different services on the **SAP Business Technology Platform (SAP BTP)**, focusing on the **SAP Document Information Extraction (DOX) Service**.

As illustrated above, the application's core purpose is to validate invoices received via e-mail or physical mail (scanned into PDF format). These invoices are stored via the **BTP Object Store Service** in an **Amazon S3 Object Store**, for example, ensuring that a persistent version of each invoice is available.

Here's the **Sequence of Interactions**:

1. The SAP Cloud Application Programming Model (CAP) backend fetches the invoices from the BTP Object Store Service, marking the beginning of the sequence of interactions.
2. After being fetched, each invoice is uploaded to the SAP Document Information Extraction (DOX) Service. With its powerful API, the service leverages Generative Artificial Intelligence (GenAI) to extract structured, meaningful data from documents such as invoices, going beyond the typical Optical Character Recognition (OCR) scanned text.
3. The SAP Document Information Extraction (DOX) Service processes the invoice and returns a job ID along with a status code indicating that the extraction is in progress. At this point, the backend initiates a periodic interval to check the processing status every 10 seconds for up to 3 minutes.
4. The SAP Document Information Extraction (DOX) Service job ID is stored in the SAP HANA Cloud Database. This database holds all invoice-related information, including the job IDs, metadata of the invoices, and invoice correction data, thereby enabling retrieval of document extraction later on.
5. Once the invoice is processed, the job ID is retrieved from the SAP HANA Cloud Database.
6. The backend then requests the extraction data from the SAP Document Information Extraction (DOX) Service using the job ID.
7. When the invoice information extraction is complete, the SAP Document Information Extraction (DOX) Service returns it in a structured JSON format.
8. The backend stores the invoice information extractions in the BTP Object Store Service.
9. When a user accesses the front end (UI5 Web Components for React), it fetches the extraction data of a specific invoice from the backend.
10. The stored invoice information extractions are retrieved from the BTP Object Store Service.
11. The extracted invoice information is sent back to the front end.

This data then populates invoice values in the UI, enhancing the user experience during invoice validation. If the extraction is not finished, the invoice appears greyed out, indicating it's not ready for validation.

[<img src="images\Solution_Diagram_Interaction_new_cache.drawio.png" width="1200"/>](images/Solution_Diagram_Interaction_new_cache.drawio.png)

## UI improvements using SAP Document Information Extraction (DOX) Service

In this case, SAP Document Information Extraction (DOX) Service is used to extract values of invoices in a structured way. Invoices that are being corrected with this invoice correction tool, contain the following information per invoice entry:

1. Position
2. Description for the entry of the invoice
3. Quantity
4. Quantity Descriptior such as pieces, t (tons), m (meters), etc.
5. Unit Price
6. Total Amount (Quantity \* Unit Price)

From the invoice validation perspective, the user has to read the values on the pdf and compare these with the actual delivered goods or services. If something does not match, the user needs to enter the values on the PDF and then the corrected values in a form to clarify that a mistake was made.

[<img src="images\without_dox_service.gif" width="1200"/>](images/without_dox_service.gif)
Invoice Correction without the use of the SAP Document Information Extraction (DOX) Service

Without the SAP Document Information Extraction (DOX) Service, all the data had to be filled out manually.
With the SAP Document Information Extraction (DOX) Service, the data has already been extracted. With that, an overlay button on top of each entry in an invoice can be shown. Upon clicking this button, the values can be filled out automatically and the user only needs to enter the revised values.

[<img src="images\with_dox_service.gif" width="1200"/>](images/with_dox_service.gif)
Invoice Correction with SAP Document Information Extraction (DOX) Service integration
