# Scenario

This part offers a comprehensive overview of the invoice validation scenario, along with the process flow and a solution diagram.

## Introduction

For multiple invoice types (e.g. construction invoices) the invoice validation or invoice check is a complex process which could often need additional domain expertise from different personas - for example external domain experts. The provided **Invoice Validation** sample scenario on **SAP Business Technology Platform (BTP)** is designed to exactly fulfil all these needs.

The application enables to do extensive and complex invoice validation outside **SAP S/4HANA Cloud (Private Edition / Public Edition)** on **SAP Business Technology Platform (BTP)** for experienced domain experts in a proper and reliable workflow. It could replace the current process which is manual, error prone and not transparent to all stakeholders, like the accounting team members responsible for payments and all external validators. Due to the **SAP Document Information Extraction (DOX)** Service assistance behind the scenes is in place, the validation work is further simplified. Furthermore, this scenario could be connected upstream of **SAP Central Invoice Management (CIM)** or **OpenText Vendor Invoice Management (VIM)** or other comparable solutions to complete the payment process afterwards.

## Process Flow

The simplified **Process Flow** of the provided scenario looks like:

[<img src="images\Process_Flow.png" width="1200"/>](images\Process_Flow.png?raw=true)

_**Picture:** Process Flow of Invoice Validation_

## Process Steps

The main **Process Steps** are:

1. The invoice arrives via email as **PDF attachment** or via **postal letter**, which will be scanned into a PDF file.
2. The invoice PDF file will be preprocessed by **SAP Document Information Extraction (DOX)** Service.
3. The invoice will be dispatched to the correct processor and afterwards validated by an **Accounting Team Member**. In case of additional expert domain knowledge is necessary, then the invoice could be forwarded to an **Internal** or **External Validator**.
4. The Internal or External Validator is doing an detailed invoice check, e.g. doing **Position Corrections**, **Deductions** and **Retentions**. After he finished his work, he sends back the invoice to the Accounting team member.
5. The Accounting Team Member is doing a last double check and forwards the validated invoice to **SAP Central Invoice Management (CIM)**, **OpenText Vendor Invoice Management (VIM)** or any other comparable solution.

## Solution Diagram

The **Solution Diagram** of the provided scenario looks like:

[<img src="images\Solution_Diagram.png" width="1200"/>](images\Solution_Diagram.png?raw=true)

_**Picture:** Application Solution Diagram of Invoice Validation_
