import jwtDecode from "jwt-decode";
import { CognitoRefreshToken, CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
// import { PIPESClient } from "../../_proto/pipes_grpc_web_pb";
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "../CognitoConfig";

let URL;

switch (process.env.REACT_APP_ENV) {
  case "prod":
    URL = "https://pipes-proxy.stratus.nrel.gov";
    break;
  case "stage":
    URL = "https://pipes-proxy-stage.stratus.nrel.gov";
    break;
  case "dev":
    URL = "https://pipes-proxy-dev.stratus.nrel.gov";
    break;
  default:
    URL = "https://pipes-proxy-dev.stratus.nrel.gov";

  // URL = "http://localhost:8080";
} 

localStorage.setItem("REACT_APP_BASE_URL", "http://0.0.0.0:8080/");
// export const pipesClient = new PIPESClient(URL);


function getCognitoToken (tokenName) {
  const idToken = localStorage.getItem("idToken");
  const accessToken = localStorage.getItem("accessToken");

  try {
    const decodedIdToken = jwtDecode(idToken);
    const idTokenExpireTime = decodedIdToken.exp * 1000;
    const decodedAccessToken = jwtDecode(accessToken);
    const accessTokenExpireTime = decodedAccessToken.exp * 1000;

    if (idTokenExpireTime < Date.now() || accessTokenExpireTime < Date.now()) {
      var cognitoRefreshToken = new CognitoRefreshToken({
        RefreshToken: localStorage.getItem("refreshToken"),
      });
      const userData = {
        Username: decodedIdToken.email,
        Pool: new CognitoUserPool({
          UserPoolId: COGNITO_USER_POOL_ID,
          ClientId: COGNITO_CLIENT_ID
        })
      };
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.refreshSession(cognitoRefreshToken, (error, session) => {
        if (error) {
          return;
        }
        const newAccessToken = session.getAccessToken().getJwtToken();
        localStorage.setItem('accessToken', newAccessToken);

        const newIdToken = session.getIdToken().getJwtToken();
        localStorage.setItem('idToken', newIdToken);
      });
    }
    return localStorage.getItem(tokenName);

  } catch (error) {
    return null;
  }
}


export const requestMetadata = {
  "x-aws-cognito-access-token": getCognitoToken("accessToken"),
  "x-aws-cognito-id-token": getCognitoToken("idToken"),
}
