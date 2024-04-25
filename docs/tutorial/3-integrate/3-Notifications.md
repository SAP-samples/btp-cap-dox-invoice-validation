## Notifications

There are multiple situations during an invoice validation flow where it makes sense to **notify** diffenent involved persons according to the current validation status.

For following situations, **information notifications** are triggered:

- **FORWARD**: An invoice has been forwarded to the next validator.
- **ACCEPTED**: An invoice has been validated and accepted.
- **REJECTED**: An invoice has been validated and rejected.
- **NEW:** A new invoice has arrived.
- **ADMIN**: A new validator has been assigned to an project.

Additionally there are situations where **trace notifications** are triggered:

- A new position correction is entered
- A new deduction is entered
- A new retention is entered
- A position is changed
- A deduction is changed
- A retention is changed
- A position is deleted
- A deduction is deleted
- A retention is deleted
- A document is uploaded
- A snapshot is downloaded

For demo purposes, the notifications are currently implemented via **logging service** hooks - some examples are:

**FORWARD** an invoice:

```
log.forward(requestorUserId, idNewCV);
```

**ACCEPT / REJECT** an invoice:

```
if (status === "ACCEPTED") {
    log.accept(req.user.id);
}

if (status === "REJECTED") {
    log.reject(req.user.id);
}
```

**ASSIGN ROLE**:

```
log.assign(project, role, userId);
```

In real implementations later on the logging service hooks needed to be replaced by real notification tools, like:

- Sending an Email
- Sending a Messenge via Messenger, like MS Teams or WhatsApp
