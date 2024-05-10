from fastapi import FastAPI
from jinja2 import Environment, PackageLoader, select_autoescape
from weasyprint import HTML
from weasyprint.text.fonts import FontConfiguration
from pypdf import PdfWriter
import base64
import io
import os

from model import Snapshot

env = Environment(loader=PackageLoader("server", "."), autoescape=select_autoescape())
app = FastAPI()
port = int(os.environ.get('PORT', 4005))

@app.post("/")
def make_snapshot(body: Snapshot):
    deductions_total = sum([d.amount for d in body.deductions])
    retentions_total = sum([r.amount for r in body.retentions])
    template = env.get_template("template.html")

    with open("rendered.html", "w") as f:
        f.write(template.render(metadata=body.metadata, currentTime=body.currentTime, corrections=body.corrections,
            totalCorrectionOverPositions=body.totalCorrectionOverPositions,
            deductions=body.deductions, deductionsTotal=deductions_total,
            retentions=body.retentions, retentionsTotal=retentions_total))

    font_config = FontConfiguration()
    html = HTML("rendered.html")
    html.write_pdf("rendered.pdf", font_config=font_config)

    # MERGE ORIGINAL AND SNAPSHOT PDFS
    bytes_original_invoice = base64.b64decode(body.originalInvoiceBase64String)
    original_invoice_file = io.BytesIO(bytes_original_invoice)
    merger = PdfWriter()
    merger.append("./rendered.pdf")
    merger.append(original_invoice_file)
    merger.write("snapshot.pdf")
    merger.close()

    with open("snapshot.pdf", 'rb') as f:
        bytes_snapshot = f.read()
    return {"snapshotBase64": base64.b64encode(bytes_snapshot)}

@app.get("/hello")
def hello():
    return "hello world"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)

