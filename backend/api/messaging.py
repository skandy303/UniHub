from twilio.rest import Client
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import ChatGrant
import os

account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
api_key = os.environ.get("TWILIO_API_TOKEN")
api_secret = os.environ.get("TWILIO_API_SECRET")


def get_convo_token(meetingKey, name):
    try:
        client = Client(account_sid, auth_token)

        conversation = client.conversations.v1.conversations(meetingKey).fetch()

        chatSID = conversation.chat_service_sid
        tokenLister = AccessToken(account_sid, api_key, api_secret, identity=name)
        chat_grant = ChatGrant(service_sid=chatSID)
        tokenLister.add_grant(chat_grant)
        return {"Error": False, "Lister": tokenLister.to_jwt()}
    except Exception as e:
        return {"Error": True, "Message": str(e)}


def create_conversation(title, uuid, listing):
    try:
        client = Client(account_sid, auth_token)
        conversation = client.conversations.v1.conversations.create(
            friendly_name=f"{title}", unique_name=f"Posting-{uuid}-{listing}"
        )

        return {"Error": False, "Data": conversation}
    except Exception as e:
        return {"Error": True, "Message": str(e)}


def get_sid(meetingKey):
    try:
        client = Client(account_sid, auth_token)

        conversation = client.conversations.v1.conversations(meetingKey).fetch()

        return {"Error": False, "Data": conversation}
    except Exception as e:
        return {"Error": True, "Message": str(e)}


def add_participant(meetingKey, identity):
    try:
        client = Client(account_sid, auth_token)
        client.conversations.v1.conversations(meetingKey).participants.create(
            identity=identity
        )
        return {"Error": False}
    except Exception as e:
        return {"Error": True, "Message": str(e)}


def create_access_token(identity, chatSID):
    try:
        tokenLister = AccessToken(account_sid, api_key, api_secret, identity=identity)
        chat_grant = ChatGrant(service_sid=chatSID)
        tokenLister.add_grant(chat_grant)
        return {"Error": False, "Data": tokenLister.to_jwt()}
    except Exception as e:
        return {"Error": True, "Message": str(e)}
