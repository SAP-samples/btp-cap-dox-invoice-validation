# Scenario

This part of the tutorial offers a comprehensive overview of the scenario addressed in this step-by-step guide, along with key technical highlights of our sample scenario.

## Introduction

For multiple invoice types (e.g. construction invoices) the invoice check / validation is a very complex process which could often need additional domain expertise and possibly different personas - like external domain experts. The provided **Invoice Validation** sample scenario on **SAP Business Technology Platform (SAP BTP)** is designed to exactly fulfil these needs.

The application enables to do extensive and complex invoice validation outside **SAP S/4HANA Cloud (Private Edition / Public Edition)** on SAP Business Technology Platform for experienced domain experts in a proper and reliable workflow. It could replace the current process which is manual, error prone and not transparent to all stakeholders, like the accounting team members responsible for payments and all external validators. Due to the **SAP Document Information Extraction (DOC) Service** assistance behind the scenes is in place, the validation work is simplified. This scenario could be connected upstream of **SAP Central Invoice Management (CIM)** or **OpenText Vendor Invoice Management (VIM)** or other comparable solutions to complete the payment process afterwards.

The simplified **Process Flow** looks like:

[<img src="images\Process_Flow.png" width="1200"/>](images\Process_Flow.png?raw=true)

The main **Process Steps** are:

1. The invoice arrives via email as PDF attachment or via postal letter, which will be scanned into PDF format.
2. The PDF invoice will be preprocessed by Document Information Extraction (DOX) Service.
3. The Invoice will be dispatched to correct processor and afterwards validated by an Accounting Team Member. In case of additional expert domain knowledge is necessary, then the invoice could be forwarded to an Internal or External Validator.

TODO: What does it mean to do a position correction; one, two examples (e.g., unit price is not what was agreed on, order amount shown for a part is higher than what was actually ordered); what are positions in an invoice

4. The Internal or External Validator is doing an detailed invoice check, e.g. doing position corrections, deductions and retentions. After he finished his work he sends back the invoice to Accounting team member.
5. The Accounting Team Member is doing a last double check and forwards the validated invoice to SAP Central Invoice Management (CIM) or OpenText Vendor Invoice Management (VIM).

The simplified **Solution Diagram** looks like:

[<img src="images\Solution_Diagram.png" width="1200"/>](images\Solution_Diagram.png?raw=true)
