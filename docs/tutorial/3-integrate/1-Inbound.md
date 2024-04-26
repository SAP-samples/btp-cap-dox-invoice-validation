## Inbound

As already mentioned in one of the former chapters - the invoices that need to be validated usually arrive attached as PDF file to emails or as postal letters which need to be scanned afterwards.

To **enhance the described scenario with own invoices** - different from the 3 provided sample invoices - the following steps are necessary:

1. Store the PDF invoice file in your Object Store of choice. Say, you use Amazon S3 (as in this sample), you can store it e.g., via
the [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/s3/). Any credentials required to be authorized to store the PDF, you can find in the service key
of your Object Store service instance. Copy the key under which you stored the PDF - will need it in the next step.
2. Add the invoice's metadata to the DOX_INVOICE table in **SAP HANA Cloud**. For that you can store the metadata as a new row first in the `dox-Invoices.csv` and deploy
the changes in the next step. Additionally, add a new entry to `dox-FlowStatuses.csv`; it represents the initial workflow status of the new invoice.
3. Deploy the changes you have made to the CSV files to HANA with `npm run deploy` (from inside the `api/` folder): Your changes should be reflected now in the  
DOX_INVOICES, DOX_FLOWSTATUSES HANA tables.