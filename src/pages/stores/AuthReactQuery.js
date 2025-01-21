import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { jwtDecode } from "jwt-decode";
import pipesConfig from "../configs/PipesConfig";
import fetchData from "../utilities/FetchData";

const userPool = new CognitoUserPool(pipesConfig.poolData);

export const loginUser = async ({ username, password }) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        resolve({
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          cognitoUser,
          session,
        });
      },
      onFailure: () => {
        reject(new Error("Incorrect username or password, please try again."));
      },
      newPasswordRequired: (userAttributes) => {
        resolve({
          newPasswordChallenge: true,
          username,
          tempPassword: password,
          userAttributes,
        });
      },
    });
  });
};
