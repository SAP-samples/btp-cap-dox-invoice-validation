from pydantic import BaseModel

# tax amount i do not need to send, already known
class Metadata(BaseModel):
    projectName: str
    invoiceId: str
    costGroup: str
    # already in readable format
    dueDate: str
    grossAmount: float
    newGrossAmount: float

class PositionCorrection(BaseModel):
    descriptor: str
    unitPrice: float
    quantity: float
    originalUnitPrice: float
    originalQuantity: float
    changedBy: str
    changedAt: str
    reason: str
class Deduction(BaseModel):
    positionDescriptor: str
    amount: float
    reason: str
class Retention(BaseModel):
    amount: float
    reason: str

class Snapshot(BaseModel):
    metadata: Metadata
    originalInvoiceBase64String: str
    currentTime: str
    corrections: list[PositionCorrection]
    totalCorrectionOverPositions: float
    deductions: list[Deduction]
    retentions: list[Retention]
