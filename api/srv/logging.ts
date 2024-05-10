import cflog from "cf-nodejs-logging-support";
import RootLogger from "cf-nodejs-logging-support/build/main/lib/logger/rootLogger";

const CUSTOM_FIELDS = ["keyword", "by", "email_sent_to", "role"];
enum Keywords {
    FORWARD = "FORWARD",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    ADMIN = "ADMIN"
}

class WorkflowLogger {
    log: RootLogger;

    constructor() {
        this.log = cflog;
        // to see format which is used for application-logging service later
        // @ts-ignore
        this.log.setCustomFieldsFormat("application-logging");
        this.log.registerCustomFields(CUSTOM_FIELDS);
    }

    forward(by: string, to: string) {
        this.log.info(`${Keywords.FORWARD}: Invoice has been forwarded to validate by ${by}. Email sent to ${to}`, {
            keyword: Keywords.FORWARD,
            by: by,
            email_sent_to: to
        });
    }

    accept(to: string) {
        this.log.info(`${Keywords.ACCEPTED}: Invoice has been validated and accepted. Email sent to ${to} to inform `, {
            keyword: Keywords.ACCEPTED,
            email_sent_to: to
        });
    }

    reject(to: string) {
        this.log.info(
            `${Keywords.REJECTED}: Invoice has been validated and rejected. Email sent to ${to} to restart validation.`,
            {
                keyword: Keywords.ACCEPTED,
                email_sent_to: to
            }
        );
    }

    assign(project: string, role: string, user: string) {
        this.log.info(
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
        this.log.info(`${Keywords.ADMIN}: you have been revoked from ${role} role. Email sent to ${user} to inform.`, {
            keyword: Keywords.ADMIN,
            role: role,
            email_sent_to: user
        });
    }

    newPosition() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`New position correction entered`);
    }

    newDeduction() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`New Deduction correction created`);
    }

    newRetention() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`New Retention correction entered`);
    }

    changedPosition() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`Changed Position`);
    }

    changedDeduction() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`Changed Deduction`);
    }

    changedRetention() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`Changed Retention`);
    }

    deletedPosition() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`Deleted Position`);
    }

    deletedDeduction() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`Deleted Deduction`);
    }

    deletedRetention() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`Deleted Retention`);
    }

    documentsUploaded() {
        this.log.setLoggingLevel("VERBOSE");
        this.log.verbose(`Document uploaded`);
    }
}

const log = new WorkflowLogger();
export default log;
