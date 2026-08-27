## Quick‑Fix Overview

1. **Add a dedicated “bounce” webhook** that receives the 550‑bounce notification from your mail provider (SendGrid, SES, Postmark, etc.).  
2. **Persist the bounce** – mark the lead as `Bounced` and store the bounce code.  
3. **Trigger a fallback** – automatically re‑attempt delivery via a secondary vendor or flag the lead for manual review.  
4. **Update the email‑sending routine** to respect the bounce status and avoid re‑sending to the same address.  

Below is a minimal, language‑agnostic implementation (Python/Flask + SQLAlchemy).  
Replace the placeholders (`<YOUR_DB_URI>`, `<SECONDARY_VENDOR_API>`, etc.) with your actual values.

---

## 1. Database Model (SQLAlchemy)

```python
# models.py
from sqlalchemy import Column, Integer, String, Enum, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
import enum
import datetime

Base = declarative_base()

class LeadStatus(enum.Enum):
    NEW = "new"
    SENT = "sent"
    BOUNCED = "bounced"
    FAILED = "failed"
    ACTIVE = "active"

class Lead(Base):
    __tablename__ = "leads"

    id          = Column(Integer, primary_key=True)
    email       = Column(String(255), nullable=False, unique=True)
    status      = Column(Enum(LeadStatus), default=LeadStatus.NEW)
    bounce_code = Column(String(10), nullable=True)
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.datetime.utcnow,
                         onupdate=datetime.datetime.utcnow)
```

---

## 2. Email‑Sending Service

```python
# email_service.py
import smtplib
from email.message import EmailMessage
from models import Lead, LeadStatus
from sqlalchemy.orm import Session

SMTP_HOST = "smtp.primary.com"
SMTP_PORT = 587
SMTP_USER = "user@primary.com"
SMTP_PASS = "pass"

def send_email(session: Session, lead_id: int, subject: str, body: str) -> None:
    lead = session.query(Lead).filter_by(id=lead_id).one()

    # Skip if already bounced
    if lead.status == LeadStatus.BOUNCED:
        raise ValueError(f"Lead {lead.email} already bounced – aborting send")

    msg = EmailMessage()
    msg["From"] = SMTP_USER
    msg["To"] = lead.email
    msg["Subject"] = subject
    msg.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USER, SMTP_PASS)
        smtp.send_message(msg)

    lead.status = LeadStatus.SENT
    session.commit()
```

---

## 3. Bounce Webhook (Flask)

```python
