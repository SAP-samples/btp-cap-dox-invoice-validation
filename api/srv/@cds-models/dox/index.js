// This is an automatically generated file. Please do not change its contents manually!
const cds = require('@sap/cds')
const csn = cds.entities('dox')
module.exports.Project = csn.Projects
module.exports.Projects = csn.Projects
module.exports.User = csn.Users
module.exports.Users = csn.Users
module.exports.Projects_User = csn.Projects_Users
module.exports.Projects_Users = csn.Projects_Users
module.exports.Invoice = csn.Invoices
module.exports.Invoices = csn.Invoices
module.exports.Deduction = csn.Deductions
module.exports.Deductions = csn.Deductions
module.exports.Retention = csn.Retentions
module.exports.Retentions = csn.Retentions
module.exports.Position = csn.Positions
module.exports.Positions = csn.Positions
module.exports.PositionCorrection = csn.PositionCorrections
module.exports.PositionCorrections = csn.PositionCorrections
module.exports.DeductionVersion = csn.DeductionVersions
module.exports.DeductionVersions = csn.DeductionVersions
module.exports.RetentionVersion = csn.RetentionVersions
module.exports.RetentionVersions = csn.RetentionVersions
module.exports.Document = csn.Documents
module.exports.Documents = csn.Documents
module.exports.FlowStatus = csn.FlowStatuses
module.exports.FlowStatuses = csn.FlowStatuses
module.exports.Comment = csn.Comments
module.exports.Comments = csn.Comments
// events
// actions
// enums
module.exports.Roles = Object.fromEntries(Object.entries(cds.model.definitions['dox.Roles'].enum).map(([k,v]) => [k,v.val]))
module.exports.WorkflowStatus = Object.fromEntries(Object.entries(cds.model.definitions['dox.WorkflowStatus'].enum).map(([k,v]) => [k,v.val]))
