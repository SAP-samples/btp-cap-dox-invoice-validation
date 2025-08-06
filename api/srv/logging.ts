import cds from "@sap/cds";

enum Keywords {
    FORWARD = "FORWARD",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    ADMIN = "ADMIN"
}

class WorkflowLogger {
    private logger = cds.log("workflow");

    forward(by: string, to: string) {
        this.logger.info(`${Keywords.FORWARD}: Invoice has been forwarded to validate by ${by}. Email sent to ${to}`, {
            keyword: Keywords.FORWARD,
            by: by,
            email_sent_to: to
        });
    }

    accept(to: string) {
        this.logger.info(
            `${Keywords.ACCEPTED}: Invoice has been validated and accepted. Email sent to ${to} to inform `,
            {
                keyword: Keywords.ACCEPTED,
                email_sent_to: to
            }
        );
    }

    reject(to: string) {
        this.logger.info(
            `${Keywords.REJECTED}: Invoice has been validated and rejected. Email sent to ${to} to restart validation.`,
            {
                keyword: Keywords.ACCEPTED,
                email_sent_to: to
            }
        );
    }

    assign(project: string, role: string, user: string) {
        this.logger.info(
            `${Keywords.ADMIN}: you have been assigned to ${project} project in the ${role} role . Email sent to ${user} to inform.`,
            {
                keyword: Keywords.ADMIN,
                project: project,
                role: role,
                email_sent_to: user
            }
        );
    }

    revoke(role: string, user: string) {
        this.logger.info(
            `${Keywords.ADMIN}: you have been revoked from ${role} role. Email sent to ${user} to inform.`,
            {
                keyword: Keywords.ADMIN,
                role: role,
                email_sent_to: user
            }
        );
    }

    newPosition() {
        this.logger.trace(`New position correction entered`);
    }

    newDeduction() {
        this.logger.trace(`New Deduction correction created`);
    }

    newRetention() {
        this.logger.trace(`New Retention correction entered`);
    }

    changedPosition() {
        this.logger.trace(`Changed Position`);
    }

    changedDeduction() {
        this.logger.trace(`Changed Deduction`);
    }

    changedRetention() {
        this.logger.trace(`Changed Retention`);
    }

    deletedPosition() {
        this.logger.trace(`Deleted Position`);
    }

    deletedDeduction() {
        this.logger.trace(`Deleted Deduction`);
    }

    deletedRetention() {
        this.logger.trace(`Deleted Retention`);
    }

    documentsUploaded() {
        this.logger.trace(`Document uploaded`);
    }

    get raw() {
        return this.logger;
    }
}

const log = new WorkflowLogger();
export default log;
