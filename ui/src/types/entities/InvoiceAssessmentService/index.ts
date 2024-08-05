// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './..';
import * as __ from './../_';
import * as _dox from './../dox';
export default { name: 'InvoiceAssessmentService' }
export function _ProjectAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Project extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        name?: string | null;
        invoices?: __.Composition.of.many<Invoices>;
        users?: __.Composition.of.many<Projects_Users>;
      static readonly actions: Record<never, never>
  };
}
export class Project extends _ProjectAspect(__.Entity) {}
Object.defineProperty(Project, 'name', { value: 'InvoiceAssessmentService.Projects' })
Object.defineProperty(Project, 'is_singular', { value: true })
export class Projects extends Array<Project> {$count?: number}
Object.defineProperty(Projects, 'name', { value: 'InvoiceAssessmentService.Projects' })

export function _InvoiceAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Invoice extends _._managedAspect(Base) {
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        invoiceID?: string;
        project?: __.Association.to<Project> | null;
        project_ID?: string | null;
        company?: string | null;
        dueDate?: __.CdsTimestamp | null;
        contact?: string | null;
        total?: number | null;
        purchaseOrder?: string | null;
        costGroup?: string | null;
        doxPositionsJobID?: string | null;
        doxLineItemsJobID?: string | null;
        s3BucketKey?: string | null;
        CV?: __.Association.to<Projects_User> | null;
        CV_project_ID?: string | null;
        CV_user_ID?: string | null;
        additionalDocuments?: __.Association.to.many<Documents>;
        positions?: __.Composition.of.many<Positions>;
        retentions?: __.Composition.of.many<Retentions>;
        deductions?: __.Composition.of.many<Deductions>;
        statuses?: __.Composition.of.many<FlowStatuses>;
        comments?: __.Composition.of.many<Comments>;
      static readonly actions: Record<never, never>
  };
}
export class Invoice extends _InvoiceAspect(__.Entity) {}
Object.defineProperty(Invoice, 'name', { value: 'InvoiceAssessmentService.Invoices' })
Object.defineProperty(Invoice, 'is_singular', { value: true })
export class Invoices extends Array<Invoice> {$count?: number}
Object.defineProperty(Invoices, 'name', { value: 'InvoiceAssessmentService.Invoices' })

export function _PositionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Position extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        index?: number | null;
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
        descriptor?: string | null;
        comment?: string | null;
        corrections?: __.Composition.of.many<PositionCorrections>;
      static readonly actions: Record<never, never>
  };
}
export class Position extends _PositionAspect(__.Entity) {}
Object.defineProperty(Position, 'name', { value: 'InvoiceAssessmentService.Positions' })
Object.defineProperty(Position, 'is_singular', { value: true })
export class Positions extends Array<Position> {$count?: number}
Object.defineProperty(Positions, 'name', { value: 'InvoiceAssessmentService.Positions' })

export function _PositionCorrectionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class PositionCorrection extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        position?: __.Association.to<Position> | null;
        position_ID?: string | null;
        revisedUnitQuantity?: number | null;
        revisedUnitPrice?: number | null;
        reason?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class PositionCorrection extends _PositionCorrectionAspect(__.Entity) {}
Object.defineProperty(PositionCorrection, 'name', { value: 'InvoiceAssessmentService.PositionCorrections' })
Object.defineProperty(PositionCorrection, 'is_singular', { value: true })
export class PositionCorrections extends Array<PositionCorrection> {$count?: number}
Object.defineProperty(PositionCorrections, 'name', { value: 'InvoiceAssessmentService.PositionCorrections' })

export function _DeductionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Deduction extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        amount?: number | null;
        reason?: string | null;
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
        positionDescriptor?: string | null;
        corrections?: __.Composition.of.many<DeductionVersions>;
      static readonly actions: Record<never, never>
  };
}
export class Deduction extends _DeductionAspect(__.Entity) {}
Object.defineProperty(Deduction, 'name', { value: 'InvoiceAssessmentService.Deductions' })
Object.defineProperty(Deduction, 'is_singular', { value: true })
export class Deductions extends Array<Deduction> {$count?: number}
Object.defineProperty(Deductions, 'name', { value: 'InvoiceAssessmentService.Deductions' })

export function _DeductionVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class DeductionVersion extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        deduction?: __.Association.to<Deduction> | null;
        deduction_ID?: string | null;
        amount?: number | null;
        reason?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class DeductionVersion extends _DeductionVersionAspect(__.Entity) {}
Object.defineProperty(DeductionVersion, 'name', { value: 'InvoiceAssessmentService.DeductionVersions' })
Object.defineProperty(DeductionVersion, 'is_singular', { value: true })
export class DeductionVersions extends Array<DeductionVersion> {$count?: number}
Object.defineProperty(DeductionVersions, 'name', { value: 'InvoiceAssessmentService.DeductionVersions' })

export function _RetentionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Retention extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        reason?: string | null;
        amount?: number | null;
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
        corrections?: __.Composition.of.many<RetentionVersions>;
      static readonly actions: Record<never, never>
  };
}
export class Retention extends _RetentionAspect(__.Entity) {}
Object.defineProperty(Retention, 'name', { value: 'InvoiceAssessmentService.Retentions' })
Object.defineProperty(Retention, 'is_singular', { value: true })
export class Retentions extends Array<Retention> {$count?: number}
Object.defineProperty(Retentions, 'name', { value: 'InvoiceAssessmentService.Retentions' })

export function _RetentionVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class RetentionVersion extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        retention?: __.Association.to<Retention> | null;
        retention_ID?: string | null;
        reason?: string | null;
        amount?: number | null;
      static readonly actions: Record<never, never>
  };
}
export class RetentionVersion extends _RetentionVersionAspect(__.Entity) {}
Object.defineProperty(RetentionVersion, 'name', { value: 'InvoiceAssessmentService.RetentionVersions' })
Object.defineProperty(RetentionVersion, 'is_singular', { value: true })
export class RetentionVersions extends Array<RetentionVersion> {$count?: number}
Object.defineProperty(RetentionVersions, 'name', { value: 'InvoiceAssessmentService.RetentionVersions' })

export function _Projects_UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Projects_User extends _._managedAspect(Base) {
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        project?: __.Association.to<Project>;
        project_ID?: string;
        user?: __.Association.to<User>;
        user_ID?: string;
        role?: _dox.Roles | null;
        craft?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class Projects_User extends _Projects_UserAspect(__.Entity) {}
Object.defineProperty(Projects_User, 'name', { value: 'InvoiceAssessmentService.Projects_Users' })
Object.defineProperty(Projects_User, 'is_singular', { value: true })
export class Projects_Users extends Array<Projects_User> {$count?: number}
Object.defineProperty(Projects_Users, 'name', { value: 'InvoiceAssessmentService.Projects_Users' })

export function _UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class User extends _._managedAspect(Base) {
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        ID?: string;
        name?: string | null;
        company?: string | null;
        projects?: __.Composition.of.many<Projects_Users>;
      static readonly actions: Record<never, never>
  };
}
export class User extends _UserAspect(__.Entity) {}
Object.defineProperty(User, 'name', { value: 'InvoiceAssessmentService.Users' })
Object.defineProperty(User, 'is_singular', { value: true })
export class Users extends Array<User> {$count?: number}
Object.defineProperty(Users, 'name', { value: 'InvoiceAssessmentService.Users' })

export function _DocumentAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Document extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
        fileName?: string | null;
        s3BucketKey?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class Document extends _DocumentAspect(__.Entity) {}
Object.defineProperty(Document, 'name', { value: 'InvoiceAssessmentService.Documents' })
Object.defineProperty(Document, 'is_singular', { value: true })
export class Documents extends Array<Document> {$count?: number}
Object.defineProperty(Documents, 'name', { value: 'InvoiceAssessmentService.Documents' })

export function _FlowStatusAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class FlowStatus extends _._cuidAspect(_._managedAspect(Base)) {
        ID?: string;
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
        processor?: __.Association.to<Projects_User> | null;
        processor_project_ID?: string | null;
        processor_user_ID?: string | null;
        descriptor?: _dox.WorkflowStatus | null;
      static readonly actions: Record<never, never>
  };
}
export class FlowStatus extends _FlowStatusAspect(__.Entity) {}
Object.defineProperty(FlowStatus, 'name', { value: 'InvoiceAssessmentService.FlowStatuses' })
Object.defineProperty(FlowStatus, 'is_singular', { value: true })
export class FlowStatuses extends Array<FlowStatus> {$count?: number}
Object.defineProperty(FlowStatuses, 'name', { value: 'InvoiceAssessmentService.FlowStatuses' })

export function _UserInfoAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class UserInfo extends Base {
        id?: string | null;
        givenName?: string | null;
        familyName?: string | null;
        company?: string | null;
        isAdmin?: boolean | null;
        projectRoles?: Array<ProjectRole>;
      static readonly actions: Record<never, never>
  };
}
export class UserInfo extends _UserInfoAspect(__.Entity) {}
Object.defineProperty(UserInfo, 'name', { value: 'InvoiceAssessmentService.UserInfo' })
Object.defineProperty(UserInfo, 'is_singular', { value: true })

export function _ProjectRoleAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class ProjectRole extends Base {
        projectId?: string | null;
        role?: string | null;
        craft?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class ProjectRole extends _ProjectRoleAspect(__.Entity) {}
Object.defineProperty(ProjectRole, 'name', { value: 'InvoiceAssessmentService.ProjectRole' })
Object.defineProperty(ProjectRole, 'is_singular', { value: true })

export function _CoordinatesAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Coordinates extends Base {
        x?: number | null;
        y?: number | null;
        w?: number | null;
        h?: number | null;
      static readonly actions: Record<never, never>
  };
}
export class Coordinates extends _CoordinatesAspect(__.Entity) {}
Object.defineProperty(Coordinates, 'name', { value: 'InvoiceAssessmentService.Coordinates' })
Object.defineProperty(Coordinates, 'is_singular', { value: true })

export function _LineItemAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class LineItem extends Base {
        name?: string | null;
        category?: string | null;
        value?: string | null;
        rawValue?: string | null;
        type?: string | null;
        page?: number | null;
        confidence?: number | null;
        coordinates?: Coordinates | null;
        model?: string | null;
        label?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class LineItem extends _LineItemAspect(__.Entity) {}
Object.defineProperty(LineItem, 'name', { value: 'InvoiceAssessmentService.LineItem' })
Object.defineProperty(LineItem, 'is_singular', { value: true })

export function _ReturnMessageAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class ReturnMessage extends Base {
        message?: string | null;
        data?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class ReturnMessage extends _ReturnMessageAspect(__.Entity) {}
Object.defineProperty(ReturnMessage, 'name', { value: 'InvoiceAssessmentService.ReturnMessage' })
Object.defineProperty(ReturnMessage, 'is_singular', { value: true })

export function _NewFlowStatusAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class NewFlowStatus extends Base {
        ID?: string | null;
        descriptor?: _dox.WorkflowStatus | null;
        createdAt?: __.CdsDate | null;
      static readonly actions: Record<never, never>
  };
}
export class NewFlowStatus extends _NewFlowStatusAspect(__.Entity) {}
Object.defineProperty(NewFlowStatus, 'name', { value: 'InvoiceAssessmentService.NewFlowStatus' })
Object.defineProperty(NewFlowStatus, 'is_singular', { value: true })

export function _CommentAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Comment extends _._cuidAspect(_._managedAspect(Base)) {
        text?: string | null;
        author?: string | null;
        invoice?: __.Association.to<_dox.Invoice> | null;
        invoice_invoiceID?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class Comment extends _CommentAspect(__.Entity) {}
Object.defineProperty(Comment, 'name', { value: 'dox.Comments' })
Object.defineProperty(Comment, 'is_singular', { value: true })
export class Comments extends Array<Comment> {$count?: number}
Object.defineProperty(Comments, 'name', { value: 'dox.Comments' })

export declare const getUserInfo: { (): UserInfo | null, __parameters: Record<never, never>, __returns: UserInfo | null, kind: 'function'};
export declare const getPdfBytesByInvoiceID: { (invoiceID: string | null): string | null, __parameters: {invoiceID: string | null}, __returns: string | null, kind: 'function'};
export declare const getPdfBytesByKey: { (s3BucketKey: string | null): string | null, __parameters: {s3BucketKey: string | null}, __returns: string | null, kind: 'function'};
export declare const getFileFromS3: { (s3BucketKey: string | null): string | null, __parameters: {s3BucketKey: string | null}, __returns: string | null, kind: 'function'};
export declare const getPositionsFromDOX: { (id: string | null): string | null, __parameters: {id: string | null}, __returns: string | null, kind: 'function'};
export declare const getLineItemsFromDOX: { (id: string | null): string | null, __parameters: {id: string | null}, __returns: string | null, kind: 'function'};
export declare const areInvoiceExtractionsCompleted: { (): string | null, __parameters: Record<never, never>, __returns: string | null, kind: 'function'};
export declare const setCV: { (projectId: string | null, idNewCV: string | null, invoiceId: string | null):  {
  message?: string | null,
  newFlowStatus?: NewFlowStatus | null,
} | null | null, __parameters: {projectId: string | null, idNewCV: string | null, invoiceId: string | null}, __returns:  {
  message?: string | null,
  newFlowStatus?: NewFlowStatus | null,
} | null | null, kind: 'action'};
export declare const acceptOrRejectInvoice: { (status: _dox.WorkflowStatus | null, invoiceId: string | null):  {
  message?: string | null,
  newFlowStatus?: NewFlowStatus | null,
} | null | null, __parameters: {status: _dox.WorkflowStatus | null, invoiceId: string | null}, __returns:  {
  message?: string | null,
  newFlowStatus?: NewFlowStatus | null,
} | null | null, kind: 'action'};
export declare const assignProjectRole: { (projectId: string | null, userId: string | null, role: _dox.Roles | null, craft: string | null): ReturnMessage | null, __parameters: {projectId: string | null, userId: string | null, role: _dox.Roles | null, craft: string | null}, __returns: ReturnMessage | null, kind: 'action'};
export declare const uploadFileToS3: { (invoiceID: string | null, fileName: string | null, file: Buffer | string | {value: import("stream").Readable, $mediaContentType: string, $mediaContentDispositionFilename?: string, $mediaContentDispositionType?: string} | null): Document | null, __parameters: {invoiceID: string | null, fileName: string | null, file: Buffer | string | {value: import("stream").Readable, $mediaContentType: string, $mediaContentDispositionFilename?: string, $mediaContentDispositionType?: string} | null}, __returns: Document | null, kind: 'action'};
export declare const uploadToDOXToGetPositions: { (id: string | null): string | null, __parameters: {id: string | null}, __returns: string | null, kind: 'action'};
export declare const uploadToDOXToGetLineItems: { (id: string | null): string | null, __parameters: {id: string | null}, __returns: string | null, kind: 'action'};
export declare const deleteFileFromS3: { (s3BucketKey: string | null, documentId: string | null): ReturnMessage | null, __parameters: {s3BucketKey: string | null, documentId: string | null}, __returns: ReturnMessage | null, kind: 'action'};
export declare const checkAllDocumentsExtractions: { (): string | null, __parameters: Record<never, never>, __returns: string | null, kind: 'action'};