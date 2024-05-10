// This is an automatically generated file. Please do not change its contents manually!
import * as __ from "./../_";
import * as _ from "./..";
// enum
export const Roles = {
    ACCOUNTING_MEMBER: "ACCOUNTING_MEMBER",
    EXTERNAL_VALIDATOR: "EXTERNAL_VALIDATOR"
};
export type Roles = "ACCOUNTING_MEMBER" | "EXTERNAL_VALIDATOR";

// enum
export const WorkflowStatus = {
    ACCOUNTING_MEMBER_CHECK: "ACCOUNTING_MEMBER_CHECK",
    EXTERNAL_VALIDATOR_CHECK: "EXTERNAL_VALIDATOR_CHECK",
    FINAL_APPROVAL: "FINAL_APPROVAL",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED"
};
export type WorkflowStatus =
    | "ACCOUNTING_MEMBER_CHECK"
    | "EXTERNAL_VALIDATOR_CHECK"
    | "FINAL_APPROVAL"
    | "ACCEPTED"
    | "REJECTED";

export function _ProjectAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Project extends Base {
        name?: string;
        invoices?: __.Composition.of.many<Invoices>;
        users?: __.Composition.of.many<Projects_Users>;
    };
}
export class Project extends _._cuidAspect(_._managedAspect(_ProjectAspect(__.Entity))) {}
export class Projects extends Array<Project> {}

export function _UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class User extends Base {
        ID?: string;
        name?: string;
        company?: string;
        projects?: __.Composition.of.many<Projects_Users>;
    };
}
export class User extends _._managedAspect(_UserAspect(__.Entity)) {}
export class Users extends Array<User> {}

export function _Projects_UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Projects_User extends Base {
        project?: __.Association.to<Project>;
        user?: __.Association.to<User>;
        role?: Roles;
        craft?: string;
    };
}
export class Projects_User extends _._managedAspect(_Projects_UserAspect(__.Entity)) {}
export class Projects_Users extends Array<Projects_User> {}

export function _InvoiceAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Invoice extends Base {
        invoiceID?: string;
        project?: __.Association.to<Project>;
        company?: string;
        dueDate?: string;
        contact?: string;
        total?: number;
        purchaseOrder?: string;
        costGroup?: string;
        doxPositionsJobID?: string;
        doxLineItemsJobID?: string;
        s3BucketKey?: string;
        CV?: __.Association.to<Projects_User>;
        additionalDocuments?: __.Association.to.many<Documents>;
        positions?: __.Composition.of.many<Positions>;
        retentions?: __.Composition.of.many<Retentions>;
        deductions?: __.Composition.of.many<Deductions>;
        statuses?: __.Composition.of.many<FlowStatuses>;
        comments?: __.Composition.of.many<Comments>;
    };
}
export class Invoice extends _._managedAspect(_InvoiceAspect(__.Entity)) {}
export class Invoices extends Array<Invoice> {}

export function _DeductionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Deduction extends Base {
        amount?: number;
        reason?: string;
        invoice?: __.Association.to<Invoice>;
        positionDescriptor?: string;
        corrections?: __.Composition.of.many<DeductionVersions>;
    };
}
export class Deduction extends _._cuidAspect(_._managedAspect(_DeductionAspect(__.Entity))) {}
export class Deductions extends Array<Deduction> {}

export function _RetentionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Retention extends Base {
        reason?: string;
        amount?: number;
        invoice?: __.Association.to<Invoice>;
        corrections?: __.Composition.of.many<RetentionVersions>;
    };
}
export class Retention extends _._cuidAspect(_._managedAspect(_RetentionAspect(__.Entity))) {}
export class Retentions extends Array<Retention> {}

export function _PositionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Position extends Base {
        index?: number;
        invoice?: __.Association.to<Invoice>;
        descriptor?: string;
        comment?: string;
        corrections?: __.Composition.of.many<PositionCorrections>;
    };
}
export class Position extends _._cuidAspect(_._managedAspect(_PositionAspect(__.Entity))) {}
export class Positions extends Array<Position> {}

export function _PositionCorrectionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class PositionCorrection extends Base {
        position?: __.Association.to<Position>;
        revisedUnitQuantity?: number;
        revisedUnitPrice?: number;
        reason?: string;
    };
}
export class PositionCorrection extends _._cuidAspect(_._managedAspect(_PositionCorrectionAspect(__.Entity))) {}
export class PositionCorrections extends Array<PositionCorrection> {}

export function _DeductionVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class DeductionVersion extends Base {
        deduction?: __.Association.to<Deduction>;
        amount?: number;
        reason?: string;
    };
}
export class DeductionVersion extends _._cuidAspect(_._managedAspect(_DeductionVersionAspect(__.Entity))) {}
export class DeductionVersions extends Array<DeductionVersion> {}

export function _RetentionVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class RetentionVersion extends Base {
        retention?: __.Association.to<Retention>;
        reason?: string;
        amount?: number;
    };
}
export class RetentionVersion extends _._cuidAspect(_._managedAspect(_RetentionVersionAspect(__.Entity))) {}
export class RetentionVersions extends Array<RetentionVersion> {}

export function _DocumentAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Document extends Base {
        invoice?: __.Association.to<Invoice>;
        fileName?: string;
        s3BucketKey?: string;
    };
}
export class Document extends _._cuidAspect(_._managedAspect(_DocumentAspect(__.Entity))) {}
export class Documents extends Array<Document> {}

export function _FlowStatusAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class FlowStatus extends Base {
        invoice?: __.Association.to<Invoice>;
        processor?: __.Association.to<Projects_User>;
        descriptor?: WorkflowStatus;
    };
}
export class FlowStatus extends _._cuidAspect(_._managedAspect(_FlowStatusAspect(__.Entity))) {}
export class FlowStatuses extends Array<FlowStatus> {}

export function _CommentAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Comment extends Base {
        text?: string;
        author?: string;
        invoice?: __.Association.to<Invoice>;
    };
}
export class Comment extends _._cuidAspect(_._managedAspect(_CommentAspect(__.Entity))) {}
export class Comments extends Array<Comment> {}
