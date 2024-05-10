// This is an automatically generated file. Please do not change its contents manually!
const cds = require('@sap/cds')
const csn = cds.entities('InvoiceAssessmentService')
module.exports.Project = csn.Projects
module.exports.Projects = csn.Projects
module.exports.Invoice = csn.Invoices
module.exports.Invoices = csn.Invoices
module.exports.Position = csn.Positions
module.exports.Positions = csn.Positions
module.exports.PositionCorrection = csn.PositionCorrections
module.exports.PositionCorrections = csn.PositionCorrections
module.exports.Deduction = csn.Deductions
module.exports.Deductions = csn.Deductions
module.exports.DeductionVersion = csn.DeductionVersions
module.exports.DeductionVersions = csn.DeductionVersions
module.exports.Retention = csn.Retentions
module.exports.Retentions = csn.Retentions
module.exports.RetentionVersion = csn.RetentionVersions
module.exports.RetentionVersions = csn.RetentionVersions
module.exports.Projects_User = csn.Projects_Users
module.exports.Projects_Users = csn.Projects_Users
module.exports.User = csn.Users
module.exports.Users = csn.Users
module.exports.Document = csn.Documents
module.exports.Documents = csn.Documents
module.exports.FlowStatus = csn.FlowStatuses
module.exports.FlowStatuses = csn.FlowStatuses
// events
// actions
module.exports.getUserInfo = 'getUserInfo'
module.exports.getPdfBytes = 'getPdfBytes'
module.exports.getPositionsFromDOX = 'getPositionsFromDOX'
module.exports.getFileFromS3 = 'getFileFromS3'
module.exports.getLineItemsFromDOX = 'getLineItemsFromDOX'
module.exports.areInvoiceExtractionsCompleted = 'areInvoiceExtractionsCompleted'
module.exports.checkAllDocumentsExtractions = 'checkAllDocumentsExtractions'
module.exports.setCV = 'setCV'
module.exports.acceptOrRejectInvoice = 'acceptOrRejectInvoice'
module.exports.assignProjectRole = 'assignProjectRole'
module.exports.uploadDocumentForExtraction = 'uploadDocumentForExtraction'
module.exports.uploadFileToS3 = 'uploadFileToS3'
module.exports.uploadToDOXToGetPositions = 'uploadToDOXToGetPositions'
module.exports.uploadToDOXToGetLineItems = 'uploadToDOXToGetLineItems'
module.exports.deleteFileFromS3 = 'deleteFileFromS3'
// enums
