const assert = require('assert');
const cds = require('@sap/cds')

const BASE_URL = "/odata/v4/invoice-assessment";

describe("WORKFLOW", () => {
    const { POST } = cds.test(__dirname+'/..')

    const ACCOUNTING = "sophia.davis@example.com"
    const EXT_VALIDATOR = "liam.wilson@example.com"
    // project SAP Walldorf Building 78
    const PROJECT = "e65de488-73f4-4aeb-86b0-8e4e9f1a9a2a"

    it("ACCOUNTING can accept/reject invoice directly", async () => {
        const { FlowStatuses } = (await cds.connect.to("InvoiceAssessmentService")).entities; 
        const invoice = "6632559877890"
        assert.equal((await SELECT.from(FlowStatuses).where({invoice_invoiceID: invoice})).length, 1);
        // reject invoice, without forwarding first to validator
        const res = await POST(`${BASE_URL}/acceptOrRejectInvoice`, {status: "REJECTED", invoiceId: invoice}, { auth: {username: ACCOUNTING, password: ''}})
        assert.equal(res.status, 200);
        const flowHistory = await SELECT.from(FlowStatuses).where({invoice_invoiceID: invoice}).orderBy("createdAt desc");
        assert.equal(flowHistory.length, 2);
        assert.ok(flowHistory[0].processor_user_ID  === null && flowHistory[0].processor_project_ID === null);
        assert.equal(flowHistory[0].descriptor, "REJECTED");
    });

    it("ACCOUNTING can forward to EXT VALIDATOR and vice versa", async () => {
        const { FlowStatuses } = (await cds.connect.to("InvoiceAssessmentService")).entities; 
        const invoice = "5435569865439"
        let res;
        try {
            // emily is on different project, thus not allowed!
            res = await POST(`${BASE_URL}/setCV`, { projectId: PROJECT, idNewCV: EXT_VALIDATOR, invoiceId: invoice }, { auth: {username: "emily.johnson@example.com", password: ''}})
        } catch(e) {
            assert.equal(e.response.status, 403);
        }
        // sophia (acc.) -> liam (ext.)
        res = await POST(`${BASE_URL}/setCV`, { projectId: PROJECT, idNewCV: EXT_VALIDATOR, invoiceId: invoice }, { auth: {username: ACCOUNTING, password: ''}})
        assert.equal(res.status, 200);
        // liam -> sophia
        res = await POST(`${BASE_URL}/setCV`, { projectId: PROJECT, idNewCV: ACCOUNTING, invoiceId: invoice }, { auth: {username: EXT_VALIDATOR, password: ''}})
        assert.equal(res.status, 200);


        // finally accept invoice
        res = await POST(`${BASE_URL}/acceptOrRejectInvoice`, {status: "ACCEPTED", invoiceId: invoice}, { auth: {username: ACCOUNTING, password: ''}})
        const flowHistory = await SELECT.from(FlowStatuses).where({invoice_invoiceID: invoice}).orderBy("createdAt desc");
        assert.equal(flowHistory.length, 4);
        assert.equal(flowHistory[1].descriptor, "FINAL_APPROVAL");
        assert.equal(res.status, 200);
    });
})
