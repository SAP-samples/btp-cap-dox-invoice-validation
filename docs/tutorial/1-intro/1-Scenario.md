# Scenario

This part of the tutorial offers a comprehensive overview of the scenario addressed in this step-by-step guide, along with key technical highlights of our sample scenario.

## Introduction

For some kind of invoice types (e.g. construction invoices) the invoice check / validation is a very complex process which could need additional domain expertise and possibly different personas. The provided code samples showcase an **Invoice Validation** sample scenario designed for the **SAP Business Technology Platform (SAP BTP)** that exactly fulfil these needs.

The application enables to do extensive and complex invoice validation outside **S/4HANA Cloud** or **S/4HANA** on SAP BTP with many different experienced experts in a proper workflow. It could replace the current process which is manual, error prone and not transparent to all stakeholders, like the accounting team members responsible for payments and all external validators. Due to the **Document Information Extraction (DOC) Service** assistance behind the scenes the validation is an easy task.

The simplified **Process Flow** looks like:

[<img src="images\Process_Flow.png" width="1200"/>](images\Process_Flow.png?raw=true)

The main process steps are:

1. The invoice arrives via email with PDF attachment or via letter, which will be scanned into PDF format.
2. The PDF invoice will be preprocessed by Document Information Extraction (DOX) Service.
3. The Invoice will be dispatched and afterwards validated by Accounting team member. In case of extended experience is necessary, then the invoice could be forwarded to an Internal or External Validator.
4. the Internal or External Validator is doing an detailed invoice check, e.g. doing position corrections, deductions and retentions. After he finished he sends back the invoice to Accounting team member.
5. The Accounting Team Member is doing a last double check and afterwards posting the corrected invoice in S/4HANA or S/4HANA Cloud.

The solution diagram looks like:

[<img src="images\Solution_Diagram.png" width="1200"/>](images\Solution_Diagram.png?raw=true)

This is the end of the story!
