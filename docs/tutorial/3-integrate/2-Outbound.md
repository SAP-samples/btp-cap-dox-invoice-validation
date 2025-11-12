## Outbound

After successful validation of the invoice, this scenario could be connected upstream of **SAP Central Invoice Management (CIM)** to complete the payment process afterwards.

To simulate the upstream you could download a PDF snapshot file (via the `Download Snapshot` button) of the validated invoice an transfer it to the dedicated file upload directory which could be accessed by **SAP Central Invoice Management (CIM)**.

In the current source code the `Accept` and `Reject` buttons are _only_ triggering notifications - in a productive scenario this behaviour has to be enhanced to trigger a real upstream scenario.

See also: [SAP Ariba Central Invoice Management](https://www.sap.com/products/spend-management/centralized-invoice-processing-software.html)
