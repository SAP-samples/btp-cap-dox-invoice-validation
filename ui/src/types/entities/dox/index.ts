// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './..';
import * as __ from './../_';
// enum
export const Roles = {
  ACCOUNTING_MEMBER: "ACCOUNTING_MEMBER",
  EXTERNAL_VALIDATOR: "EXTERNAL_VALIDATOR",
} as const;
export type Roles = "ACCOUNTING_MEMBER" | "EXTERNAL_VALIDATOR"

// enum
export const WorkflowStatus = {
  ACCOUNTING_MEMBER_CHECK: "ACCOUNTING_MEMBER_CHECK",
  EXTERNAL_VALIDATOR_CHECK: "EXTERNAL_VALIDATOR_CHECK",
  FINAL_APPROVAL: "FINAL_APPROVAL",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;
export type WorkflowStatus = "ACCOUNTING_MEMBER_CHECK" | "EXTERNAL_VALIDATOR_CHECK" | "FINAL_APPROVAL" | "ACCEPTED" | "REJECTED"

export function _ProjectAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Project extends _._cuidAspect(_._managedAspect(Base)) {
        name?: string | null;
        invoices?: __.Composition.of.many<Invoices>;
        users?: __.Composition.of.many<Projects_Users>;
      static readonly actions: Record<never, never>
  };
}
export class Project extends _ProjectAspect(__.Entity) {}
Object.defineProperty(Project, 'name', { value: 'dox.Projects' })
Object.defineProperty(Project, 'is_singular', { value: true })
export class Projects extends Array<Project> {$count?: number}
Object.defineProperty(Projects, 'name', { value: 'dox.Projects' })

export function _UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class User extends _._managedAspect(Base) {
        ID?: string;
        name?: string | null;
        company?: string | null;
        projects?: __.Composition.of.many<Projects_Users>;
      static readonly actions: Record<never, never>
  };
}
export class User extends _UserAspect(__.Entity) {}
Object.defineProperty(User, 'name', { value: 'dox.Users' })
Object.defineProperty(User, 'is_singular', { value: true })
export class Users extends Array<User> {$count?: number}
Object.defineProperty(Users, 'name', { value: 'dox.Users' })

export function _Projects_UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Projects_User extends _._managedAspect(Base) {
        project?: __.Association.to<Project>;
        project_ID?: string;
        user?: __.Association.to<User>;
        user_ID?: string;
        role?: Roles | null;
        craft?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class Projects_User extends _Projects_UserAspect(__.Entity) {}
Object.defineProperty(Projects_User, 'name', { value: 'dox.Projects_Users' })
Object.defineProperty(Projects_User, 'is_singular', { value: true })
export class Projects_Users extends Array<Projects_User> {$count?: number}
Object.defineProperty(Projects_Users, 'name', { value: 'dox.Projects_Users' })

export function _InvoiceAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Invoice extends _._managedAspect(Base) {
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
Object.defineProperty(Invoice, 'name', { value: 'dox.Invoices' })
Object.defineProperty(Invoice, 'is_singular', { value: true })
export class Invoices extends Array<Invoice> {$count?: number}
Object.defineProperty(Invoices, 'name', { value: 'dox.Invoices' })

export function _DeductionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Deduction extends _._cuidAspect(_._managedAspect(Base)) {
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
Object.defineProperty(Deduction, 'name', { value: 'dox.Deductions' })
Object.defineProperty(Deduction, 'is_singular', { value: true })
export class Deductions extends Array<Deduction> {$count?: number}
Object.defineProperty(Deductions, 'name', { value: 'dox.Deductions' })

export function _RetentionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Retention extends _._cuidAspect(_._managedAspect(Base)) {
        reason?: string | null;
        amount?: number | null;
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
        corrections?: __.Composition.of.many<RetentionVersions>;
      static readonly actions: Record<never, never>
  };
}
export class Retention extends _RetentionAspect(__.Entity) {}
Object.defineProperty(Retention, 'name', { value: 'dox.Retentions' })
Object.defineProperty(Retention, 'is_singular', { value: true })
export class Retentions extends Array<Retention> {$count?: number}
Object.defineProperty(Retentions, 'name', { value: 'dox.Retentions' })

export function _PositionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Position extends _._cuidAspect(_._managedAspect(Base)) {
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
Object.defineProperty(Position, 'name', { value: 'dox.Positions' })
Object.defineProperty(Position, 'is_singular', { value: true })
export class Positions extends Array<Position> {$count?: number}
Object.defineProperty(Positions, 'name', { value: 'dox.Positions' })

export function _PositionCorrectionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class PositionCorrection extends _._cuidAspect(_._managedAspect(Base)) {
        position?: __.Association.to<Position> | null;
        position_ID?: string | null;
        revisedUnitQuantity?: number | null;
        revisedUnitPrice?: number | null;
        reason?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class PositionCorrection extends _PositionCorrectionAspect(__.Entity) {}
Object.defineProperty(PositionCorrection, 'name', { value: 'dox.PositionCorrections' })
Object.defineProperty(PositionCorrection, 'is_singular', { value: true })
export class PositionCorrections extends Array<PositionCorrection> {$count?: number}
Object.defineProperty(PositionCorrections, 'name', { value: 'dox.PositionCorrections' })

export function _DeductionVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class DeductionVersion extends _._cuidAspect(_._managedAspect(Base)) {
        deduction?: __.Association.to<Deduction> | null;
        deduction_ID?: string | null;
        amount?: number | null;
        reason?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class DeductionVersion extends _DeductionVersionAspect(__.Entity) {}
Object.defineProperty(DeductionVersion, 'name', { value: 'dox.DeductionVersions' })
Object.defineProperty(DeductionVersion, 'is_singular', { value: true })
export class DeductionVersions extends Array<DeductionVersion> {$count?: number}
Object.defineProperty(DeductionVersions, 'name', { value: 'dox.DeductionVersions' })

export function _RetentionVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class RetentionVersion extends _._cuidAspect(_._managedAspect(Base)) {
        retention?: __.Association.to<Retention> | null;
        retention_ID?: string | null;
        reason?: string | null;
        amount?: number | null;
      static readonly actions: Record<never, never>
  };
}
export class RetentionVersion extends _RetentionVersionAspect(__.Entity) {}
Object.defineProperty(RetentionVersion, 'name', { value: 'dox.RetentionVersions' })
Object.defineProperty(RetentionVersion, 'is_singular', { value: true })
export class RetentionVersions extends Array<RetentionVersion> {$count?: number}
Object.defineProperty(RetentionVersions, 'name', { value: 'dox.RetentionVersions' })

export function _DocumentAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Document extends _._cuidAspect(_._managedAspect(Base)) {
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
        fileName?: string | null;
        s3BucketKey?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class Document extends _DocumentAspect(__.Entity) {}
Object.defineProperty(Document, 'name', { value: 'dox.Documents' })
Object.defineProperty(Document, 'is_singular', { value: true })
export class Documents extends Array<Document> {$count?: number}
Object.defineProperty(Documents, 'name', { value: 'dox.Documents' })

export function _FlowStatusAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class FlowStatus extends _._cuidAspect(_._managedAspect(Base)) {
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
        processor?: __.Association.to<Projects_User> | null;
        processor_project_ID?: string | null;
        processor_user_ID?: string | null;
        descriptor?: WorkflowStatus | null;
      static readonly actions: Record<never, never>
  };
}
export class FlowStatus extends _FlowStatusAspect(__.Entity) {}
Object.defineProperty(FlowStatus, 'name', { value: 'dox.FlowStatuses' })
Object.defineProperty(FlowStatus, 'is_singular', { value: true })
export class FlowStatuses extends Array<FlowStatus> {$count?: number}
Object.defineProperty(FlowStatuses, 'name', { value: 'dox.FlowStatuses' })

export function _CommentAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Comment extends _._cuidAspect(_._managedAspect(Base)) {
        text?: string | null;
        author?: string | null;
        invoice?: __.Association.to<Invoice> | null;
        invoice_invoiceID?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class Comment extends _CommentAspect(__.Entity) {}
Object.defineProperty(Comment, 'name', { value: 'dox.Comments' })
Object.defineProperty(Comment, 'is_singular', { value: true })
export class Comments extends Array<Comment> {$count?: number}
Object.defineProperty(Comments, 'name', { value: 'dox.Comments' })
