from twilio.rest import Client
from app.core.config import settings

def send_sms(to: str, message: str):
    client = Client(settings.TWILIO_SID, settings.TWILIO_TOKEN)
    client.messages.create(body=message, from_=settings.TWILIO_FROM, to=to)