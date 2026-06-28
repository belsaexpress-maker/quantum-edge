from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME or "your@email.com",
    MAIL_PASSWORD=settings.MAIL_PASSWORD or "password",
    MAIL_FROM=settings.MAIL_FROM or "noreply@quantumedge.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False
)

async def send_email(to: str, subject: str, body: str):
    message = MessageSchema(subject=subject, recipients=[to], body=body, subtype="html")
    fm = FastMail(conf)
    await fm.send_message(message)