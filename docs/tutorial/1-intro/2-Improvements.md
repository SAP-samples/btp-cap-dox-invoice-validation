## UI Improvements

The **SAP Document Information Extraction (DOX)** Service is used to extract values of invoices in a structured way - invoices that are being corrected, contain the following information per invoice entry:

1. Position
2. Description (for the entry of the invoice)
3. Quantity
4. Quantity Descriptior, like p (pieces), t (tons), m (meters), etc.
5. Unit Price
6. Total Amount (Quantity \* Unit Price)

From the invoice validation perspective, the user has to read the values on the PDF and compare these with the actual delivered positions. If anything does not match, the user needs to enter the values on the PDF and then the corrected values in a form to indicate that a correction was made.

[<img src="images\without_dox_service.gif" width="1200"/>](images/without_dox_service.gif)
_**Picture:** Invoice Correction without the use of the SAP Document Information Extraction (DOX) Service_

Without the **SAP Document Information Extraction (DOX)** Service, all the data had to be filled out manually.
With the **SAP Document Information Extraction (DOX)** Service, the data has already been extracted. With that, an overlay button on top of each position in an invoice can be shown. Upon clicking this button, the values can be filled out automatically and the user only needs to enter the revised values.

[<img src="images\with_dox_service.gif" width="1200"/>](images/with_dox_service.gif)
_**Picture:** Invoice Correction with SAP Document Information Extraction (DOX) Service integration_