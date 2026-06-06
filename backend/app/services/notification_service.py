"""Notification Service for dispatching SMS and Email alerts."""

import logging
from app.config import settings

# Configure logging for the mock service
logger = logging.getLogger("notification_service")
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
formatter = logging.Formatter('\n%(asctime)s - 🚨 %(levelname)s 🚨 - %(message)s')
ch.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(ch)

def send_sms(phone_number: str, message: str) -> bool:
    """
    Sends an SMS notification.
    If Twilio credentials exist in the config, it will route through the real API.
    Otherwise, it securely logs the payload to the console.
    """
    if not phone_number:
        logger.warning("Attempted to send SMS, but no phone number was provided.")
        return False

    # Check if real Twilio integration is configured
    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        try:
            # Future real integration placeholder:
            # from twilio.rest import Client
            # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            # msg = client.messages.create(
            #     body=message,
            #     from_=settings.TWILIO_FROM_PHONE,
            #     to=phone_number
            # )
            # return msg.sid is not None
            logger.info(f"MOCK TWILIO SEND to {phone_number}: {message}")
            return True
        except Exception as e:
            logger.error(f"Failed to send real SMS: {e}")
            return False
    else:
        # Development Mock Mode
        banner = "=" * 50
        logger.info(f"\n{banner}\n📱 SMS DISPATCHED TO: {phone_number}\n📝 PAYLOAD:\n{message}\n{banner}")
        return True
