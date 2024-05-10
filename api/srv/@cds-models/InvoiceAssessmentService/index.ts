// This is an automatically generated file. Please do not change its contents manually!
import * as _dox from "./../dox";
import * as __ from "./../_";
import * as _ from "./..";
export type User = {
    id?: string;
    givenName?: string;
    familyName?: string;
    company?: string;
    isAdmin?: boolean;
    projectRoles?: Array<ProjectRole>;
};
export type ProjectRole = {
    projectId?: string;
    role?: string;
    craft?: string;
};
export type Coordinates = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
};
export type LineItem = {
    name?: string;
    category?: string;
    value?: string;
    rawValue?: string;
    type?: string;
    page?: number;
    confidence?: number;
    coordinates?: Coordinates;
    model?: string;
    label?: string;
};
export type ReturnMessage = {
    message?: string;
    data?: string;
};
export type FlowStatus = {
    ID?: string;
    descriptor?: _dox.WorkflowStatus;
    createdAt?: string;
};
export function _ProjectAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Project extends Base {
        name?: string;
        invoices?: __.Composition.of.many<_dox.Invoices>;
        users?: __.Composition.of.many<_dox.Projects_Users>;
    };
}
export class Project extends _._cuidAspect(_._managedAspect(_ProjectAspect(__.Entity))) {}
export class Projects extends Array<Project> {}

export function _InvoiceAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Invoice extends Base {
        invoiceID?: string;
        project?: __.Association.to<_dox.Project>;
        company?: string;
        dueDate?: string;
        contact?: string;
        total?: number;
        purchaseOrder?: string;
        costGroup?: string;
        doxPositionsJobID?: string;
        doxLineItemsJobID?: string;
        s3BucketKey?: string;
        CV?: __.Association.to<_dox.Projects_User>;
        additionalDocuments?: __.Association.to.many<_dox.Documents>;
        positions?: __.Composition.of.many<_dox.Positions>;
        retentions?: __.Composition.of.many<_dox.Retentions>;
        deductions?: __.Composition.of.many<_dox.Deductions>;
        statuses?: __.Composition.of.many<_dox.FlowStatuses>;
        comments?: __.Composition.of.many<_dox.Comments>;
    };
}
export class Invoice extends _._managedAspect(_InvoiceAspect(__.Entity)) {}
export class Invoices extends Array<Invoice> {}

export function _PositionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Position extends Base {
        index?: number;
        invoice?: __.Association.to<_dox.Invoice>;
        descriptor?: string;
        comment?: string;
        corrections?: __.Composition.of.many<_dox.PositionCorrections>;
    };
}
export class Position extends _._cuidAspect(_._managedAspect(_PositionAspect(__.Entity))) {}
export class Positions extends Array<Position> {}

export function _PositionCorrectionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class PositionCorrection extends Base {
        position?: __.Association.to<_dox.Position>;
        revisedUnitQuantity?: number;
        revisedUnitPrice?: number;
        reason?: string;
    };
}
export class PositionCorrection extends _._cuidAspect(_._managedAspect(_PositionCorrectionAspect(__.Entity))) {}
export class PositionCorrections extends Array<PositionCorrection> {}

export function _DeductionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Deduction extends Base {
        amount?: number;
        reason?: string;
        invoice?: __.Association.to<_dox.Invoice>;
        positionDescriptor?: string;
        corrections?: __.Composition.of.many<_dox.DeductionVersions>;
    };
}
export class Deduction extends _._cuidAspect(_._managedAspect(_DeductionAspect(__.Entity))) {}
export class Deductions extends Array<Deduction> {}

export function _DeductionVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class DeductionVersion extends Base {
        deduction?: __.Association.to<_dox.Deduction>;
        amount?: number;
        reason?: string;
    };
}
export class DeductionVersion extends _._cuidAspect(_._managedAspect(_DeductionVersionAspect(__.Entity))) {}
export class DeductionVersions extends Array<DeductionVersion> {}

export function _RetentionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Retention extends Base {
        reason?: string;
        amount?: number;
        invoice?: __.Association.to<_dox.Invoice>;
        corrections?: __.Composition.of.many<_dox.RetentionVersions>;
    };
}
export class Retention extends _._cuidAspect(_._managedAspect(_RetentionAspect(__.Entity))) {}
export class Retentions extends Array<Retention> {}

export function _RetentionVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class RetentionVersion extends Base {
        retention?: __.Association.to<_dox.Retention>;
        reason?: string;
        amount?: number;
    };
}
export class RetentionVersion extends _._cuidAspect(_._managedAspect(_RetentionVersionAspect(__.Entity))) {}
export class RetentionVersions extends Array<RetentionVersion> {}

export function _Projects_UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Projects_User extends Base {
        project?: __.Association.to<_dox.Project>;
        user?: __.Association.to<_dox.User>;
        role?: _dox.Roles;
        craft?: string;
    };
}
export class Projects_User extends _._managedAspect(_Projects_UserAspect(__.Entity)) {}
export class Projects_Users extends Array<Projects_User> {}

export function _UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class User extends Base {
        ID?: string;
        name?: string;
        company?: string;
        projects?: __.Composition.of.many<_dox.Projects_Users>;
    };
}
export class User extends _._managedAspect(_UserAspect(__.Entity)) {}
export class Users extends Array<User> {}

export function _DocumentAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Document extends Base {
        invoice?: __.Association.to<_dox.Invoice>;
        fileName?: string;
        s3BucketKey?: string;
    };
}
export class Document extends _._cuidAspect(_._managedAspect(_DocumentAspect(__.Entity))) {}
export class Documents extends Array<Document> {}

export function _FlowStatusAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class FlowStatus extends Base {
        invoice?: __.Association.to<_dox.Invoice>;
        processor?: __.Association.to<_dox.Projects_User>;
        descriptor?: _dox.WorkflowStatus;
    };
}
export class FlowStatus extends _._cuidAspect(_._managedAspect(_FlowStatusAspect(__.Entity))) {}
export class FlowStatuses extends Array<FlowStatus> {}

// action
export declare const getUserInfo: () => User;
// action
export declare const getPdfBytes: (invoiceID: string) => string;
// action
export declare const getPositionsFromDOX: (id: string) => string;
// action
export declare const getFileFromS3: (s3BucketKey: string) => string;
// action
export declare const getLineItemsFromDOX: (id: string) => string;
// action
export declare const areInvoiceExtractionsCompleted: () => string;
// action
export declare const checkAllDocumentsExtractions: () => string;
// function
export declare const setCV: (
    projectId: string,
    idNewCV: string,
    invoiceId: string
) => {
    message?: string;
    newFlowStatus?: FlowStatus;
};
// function
export declare const acceptOrRejectInvoice: (
    status: _dox.WorkflowStatus,
    invoiceId: string
) => {
    message?: string;
    newFlowStatus?: FlowStatus;
};
// function
export declare const assignProjectRole: (
    projectId: string,
    userId: string,
    role: _dox.Roles,
    craft: string
) => ReturnMessage;
// function
export declare const uploadDocumentForExtraction: () => ReturnMessage;
// function
export declare const uploadFileToS3: (invoiceID: string, fileName: string, file: Buffer | string) => Documents;
// function
export declare const uploadToDOXToGetPositions: (id: string) => string;
// function
export declare const uploadToDOXToGetLineItems: (id: string) => string;
// function
export declare const deleteFileFromS3: (s3BucketKey: string, documentId: string) => ReturnMessage;
