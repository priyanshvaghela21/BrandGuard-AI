import csv
import io
from typing import List
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/audit", tags=["Governance & Compliance Audit History"])

@router.get("", response_model=List[AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all permanent compliance audit trails."""
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).all()
    return logs

@router.get("/export")
def export_audit_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export compliance audit trails as downloadable CSV."""
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Audit ID", "Title", "Author", "Approver", "Status",
        "Score", "Issues Fixed", "Certificate Seal", "Timestamp"
    ])

    for log in logs:
        writer.writerow([
            log.audit_id, log.title, log.author, log.approver, log.status,
            log.score, log.issues_fixed, log.certificate_seal or "N/A",
            log.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=brandguard_audit_trail.csv"}
    )
