## Notifications

There are multiple situations during an invoice validation flow where it makes sense to **notify** different involved personas according to the current validation status.

For following situations, **information notifications** could be triggered:

-   **FORWARD**: An invoice has been forwarded to the next validator.
-   **ACCEPTED**: An invoice has been validated and accepted.
-   **REJECTED**: An invoice has been validated and rejected.
-   **NEW:** A new invoice has arrived.
-   **ADMIN**: A new validator has been assigned to a project.

Additionally, there are situations where **trace notifications** could be triggered:

-   A new position correction is entered
-   A new deduction is entered
-   A new retention is entered
-   A position is changed
-   A deduction is changed
-   A retention is changed
-   A position is deleted
-   A deduction is deleted
-   A retention is deleted
-   A document is uploaded
-   A snapshot is downloaded

For demo purposes, we simulated this idea to send out notifications, in that we write logs through the [CAP's native CDS logger](https://cap.cloud.sap/docs/node.js/cds-log#cds-log-logger) in those situations. Here are a few examples:

**FORWARD** an invoice:

```js
log.forward(requestorUserId, idNewCV);
```

which in turn calls

```js
function forward(by: string, to: string) {
    this.logger.info(`${Keywords.FORWARD}: Invoice has been forwarded to validate by ${by}. Email sent to ${to}`, {
        keyword: Keywords.FORWARD,
        by: by,
        email_sent_to: to
    });
}
```

**ACCEPT/REJECT** an invoice:

```js
if (status === "ACCEPTED") {
    log.accept(req.user.id);
}

if (status === "REJECTED") {
    log.reject(req.user.id);
}
```

which e.g., calls

```js
function accept(to: string) {
    this.logger.info(`${Keywords.ACCEPTED}: Invoice has been validated and accepted. Email sent to ${to} to inform `, {
        keyword: Keywords.ACCEPTED,
        email_sent_to: to
    });
}
```

**ASSIGN ROLE**:

```js
log.assign(project, role, userId);
```

You get the gist of it.

In a real implementation later the logs above would need to be replaced by API calls to real notification tools. Imagine things like:

-   Sending an Email
-   Sending a message to something like Microsoft Teams or WhatsApp
