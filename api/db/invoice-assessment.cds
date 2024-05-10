namespace dox;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Projects : cuid, managed {
    name     : String;
    invoices : Composition of many Invoices
                   on invoices.project = $self;
    users    : Composition of many Projects_Users
                   on users.project = $self;
}

entity Users : managed {
    key ID       : String; // user email
        name     : String;
        company  : String;
        projects : Composition of many Projects_Users
                       on projects.user = $self;
}

entity Projects_Users : managed {
    key project : Association to Projects;
    key user    : Association to Users;
        role    : Roles;
        craft   : String;
}

entity Invoices : managed {
    key invoiceID           : String;
        project             : Association to Projects;
        company             : String;
        dueDate             : Timestamp;
        contact             : String;
        total               : Double;
        purchaseOrder       : String;
        costGroup           : String;
        doxPositionsJobID   : UUID;
        doxLineItemsJobID   : UUID;
        s3BucketKey         : String;
        CV                  : Association to Projects_Users; // current validator (CV)
        additionalDocuments : Association to many Documents
                                  on additionalDocuments.invoice = $self;
        positions           : Composition of many Positions
                                  on positions.invoice = $self;
        retentions          : Composition of many Retentions
                                  on retentions.invoice = $self;
        deductions          : Composition of many Deductions
                                  on deductions.invoice = $self;
        statuses            : Composition of many FlowStatuses
                                  on statuses.invoice = $self;
        comments            : Composition of many Comments
                                  on comments.invoice = $self;
}

entity Deductions : cuid, managed {
    amount             : Double;
    reason             : String;
    invoice            : Association to Invoices;
    positionDescriptor : String;
    corrections        : Composition of many DeductionVersions
                             on corrections.deduction = $self;
}

entity Retentions : cuid, managed {
    reason      : String;
    amount      : Double;
    invoice     : Association to Invoices;
    corrections : Composition of many RetentionVersions
                      on corrections.retention = $self;
}

entity Positions : cuid, managed {
    index       : Int16;
    invoice     : Association to Invoices;
    descriptor  : String;
    comment     : String;
    corrections : Composition of many PositionCorrections
                      on corrections.position = $self;
}

entity PositionCorrections : cuid, managed {
    position            : Association to Positions;
    revisedUnitQuantity : Double;
    revisedUnitPrice    : Double;
    reason              : String;
}

entity DeductionVersions : cuid, managed {
    deduction : Association to Deductions;
    amount    : Double;
    reason    : String;
}

entity RetentionVersions : cuid, managed {
    retention : Association to Retentions;
    reason    : String;
    amount    : Double;
}

entity Documents : cuid, managed {
    invoice     : Association to Invoices;
    fileName    : String;
    s3BucketKey : String;
}

entity FlowStatuses : cuid, managed {
    invoice    : Association to Invoices;
    processor  : Association to Projects_Users;
    descriptor : WorkflowStatus;
}

entity Comments : cuid, managed {
    text    : String;
    author  : String;
    invoice : Association to Invoices;
}

type Roles          : String @assert.range enum {
    ACCOUNTING_MEMBER        = 'ACCOUNTING_MEMBER';
    EXTERNAL_VALIDATOR       = 'EXTERNAL_VALIDATOR';
}

type WorkflowStatus : String @assert.range enum {
    ACCOUNTING_MEMBER_CHECK  = 'ACCOUNTING_MEMBER_CHECK';
    EXTERNAL_VALIDATOR_CHECK = 'EXTERNAL_VALIDATOR_CHECK';
    FINAL_APPROVAL           = 'FINAL_APPROVAL';
    ACCEPTED                 = 'ACCEPTED';
    REJECTED                 = 'REJECTED';
}
