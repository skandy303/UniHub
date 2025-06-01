import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import *


def sendEmail(message):
    sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
    response = sg.send(message)
    return response
