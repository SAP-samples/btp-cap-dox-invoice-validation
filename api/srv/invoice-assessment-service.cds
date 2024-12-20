using {dox} from '../db/invoice-assessment';


service InvoiceAssessmentService {
    @readonly
    entity Projects            as projection on dox.Projects;

    @readonly
    entity Invoices            as projection on dox.Invoices;

    entity Positions           as projection on dox.Positions;
    entity PositionCorrections as projection on dox.PositionCorrections;
    entity Deductions          as projection on dox.Deductions;
    entity DeductionVersions   as projection on dox.DeductionVersions;
    entity Retentions          as projection on dox.Retentions;
    entity RetentionVersions   as projection on dox.RetentionVersions;
    entity Projects_Users      as projection on dox.Projects_Users;
    entity Users               as projection on dox.Users;
    entity Documents           as projection on dox.Documents;

    @readonly
    entity FlowStatuses        as projection on dox.FlowStatuses;

    type UserInfo {
        id           : String;
        givenName    : String;
        familyName   : String;
        company      : String;
        isAdmin      : Boolean;
        projectRoles : array of ProjectRole;
    }

    type ProjectRole {
        projectId : String;
        role      : String;
        craft     : String;
    }

    type Coordinates : {
        x : Double;
        y : Double;
        w : Double;
        h : Double;
    };

    type LineItem    : {
        name        : String;
        category    : String;
        value       : String;
        rawValue    : String;
        type        : String;
        page        : Integer;
        confidence  : Double;
        coordinates : Coordinates;
        model       : String;
        label       : String;
    };

    // FUNCTIONS

    function getUserInfo()                                                                            returns UserInfo;
    function getPdfBytesByInvoiceID(invoiceID : String)                                               returns LargeString;
    function getPdfBytesByKey(s3BucketKey : String)                                                   returns LargeString;
    function getFileFromS3(s3BucketKey : String)                                                      returns LargeString;
    function getPositionsFromDOX(id : String)                                                         returns String;
    function getLineItemsFromDOX(id : String)                                                         returns String;
    function areInvoiceExtractionsCompleted()                                                         returns { done: array of String; pending: array of String; };
    // returns json of dox response, no good type for that unfortunately
    // says String, but still returns json
    function doxGetPositions(invoiceID: String)                                                       returns String;
    function doxGetLineItems(invoiceID: String)                                                       returns String;

    type ReturnMessage {
        message : String;
        data    : String;
    }

    type NewFlowStatus {
        ID         : String;
        descriptor : dox.WorkflowStatus;
        createdAt  : Date;
    }

    // ACTIONS

    action   setCV(projectId : String, idNewCV : String, invoiceId : String)                          returns {
        message : String;
        newFlowStatus : NewFlowStatus;
    };

    action   acceptOrRejectInvoice(status : dox.WorkflowStatus, invoiceId : String)                   returns {
        message : String;
        newFlowStatus : NewFlowStatus;
    };

    action   assignProjectRole(projectId : String, userId : String, role : dox.Roles, craft : String) returns ReturnMessage;
    action   uploadFileToS3(invoiceID : String, fileName : String, file : LargeBinary)                returns Documents;
    action   uploadToDOXToGetPositions(id : String)                                                   returns String;
    action   uploadToDOXToGetLineItems(id : String)                                                   returns String;
    action   deleteFileFromS3(s3BucketKey : String, documentId : String)                              returns ReturnMessage;
    action   doxExtractFromInvoices();
}
