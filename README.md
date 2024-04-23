# Facilitate Invoice Validation — leveraging Document Information Extraction
<!--- Register repository https://api.reuse.software/register, then add REUSE badge:
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/REPO-NAME)](https://api.reuse.software/info/github.com/SAP-samples/REPO-NAME)
-->
Invoice validation is often an opaque, manual and error-prone process. It involves editing invoice PDF files directly, or sending them back and forth via email between multiple parties—
until it can finally be approved for payment.

This sample tries to alleviate some of those pain points. It presupposes a clearly defined validation workflow. More importantly,
it simplifies and accelerates validation, allowing to quickly copy over entries from the original invoice, correct entries; and then forward the invoice to the next person in line
in the workflow to validate it further. As a side effect each correction and the rationale behind it is documented over time.

For that _Document Information Extraction_ ([DOX](https://help.sap.com/docs/document-information-extraction/document-information-extraction/what-is-document-information-extraction?locale=en-US))
—a service on the _Business Technology Platform_ ([BTP](https://help.sap.com/docs/btp/sap-business-technology-platform/sap-business-technology-platform?locale=en-US))—
and the _Cloud Programming Model_ ([CAP](https://cap.cloud.sap/docs/)) is leveraged. The sample runs _entirely_ on BTP. Think of it as a separate extension to _SAP Central Invoice Management_ (CIM)
or _OpenText Vendor Invoice Management_, rather than it trying to compete with the latter.
<p align="center">
    <img src="./docs/tutorial/1-intro/images/Solution_Diagram.png" alt="architecture diagram" />
    <em>Sample architecture with DOX and CAP at its core</em>
</p>

## Getting started
Feel free to check out these links to get started working with the sample. 

- Intro
  - [Scenario](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/1-intro/1-Scenario.md)<!-- dc-card: {"label": ["Scenario"]} dc-card -->
  - [Improvements](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/1-intro/2-Improvements.md)<!-- dc-card: {"label": ["Improvements"]} dc-card -->
  - [Interaction](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/1-intro/3-Interaction.md)<!-- dc-card: {"label": ["Interaction"]} dc-card -->
- Setup
  - [Subaccount](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/2-setup/1-Subaccount.md)<!-- dc-card: {"label": ["Subaccount"]} dc-card -->
  - [Entitlements](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/2-setup/2-Entitlements.md)<!-- dc-card: {"label": ["Entitlements"]} dc-card -->
  - [Initial Deployment](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/2-setup/3-InitialDeployment.md)<!-- dc-card: {"label": ["Initial Deployment"]} dc-card -->
  - [Extensions](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/2-setup/4-Extensions.md)<!-- dc-card: {"label": ["Extensions"]} dc-card -->
- Integration
  - [Inbound](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/3-integrate/1-Inbound.md)<!-- dc-card: {"label":  ["Inbound"]} dc-card -->
  - [Outbound](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/3-integrate/2-Outbound.md)<!-- dc-card: {"label":  ["Outbound"]} dc-card -->
  - [Notifications](https://github.com/SAP-samples/btp-cap-dox-invoice-validation/blob/main/docs/tutorial/3-integrate/2-Notifications.md)<!-- dc-card: {"label":  ["Notifications"]} dc-card -->

## Known Issues
No known issues as of now.

## How to obtain support
[Create an issue](https://github.com/SAP-samples/<repository-name>/issues) in this repository if you find a bug or have questions about the content.
 
## Contributing
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
