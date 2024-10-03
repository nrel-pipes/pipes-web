import os
import boto3
from dotenv import load_dotenv

load_dotenv()

cognito_idp = boto3.client("cognito-idp", region_name="us-west-2")


def get_cognito_access_token(username, password):
    """Get Cognit access token for Bearer authentication"""
    response = cognito_idp.initiate_auth(
        AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": username,
            "PASSWORD": password,
        },
        ClientId=os.getenv("PIPES_COGNITO_CLIENT_ID"),
    )
    access_token = response["AuthenticationResult"]["AccessToken"]
    return access_token
