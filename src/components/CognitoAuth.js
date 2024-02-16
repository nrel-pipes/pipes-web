import { useState } from "react"

import { CognitoUser, CognitoUserPool, AuthenticationDetails} from "amazon-cognito-identity-js"
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "./CognitoConfig";

// Cognito Configuration
const poolData = {
  UserPoolId: COGNITO_USER_POOL_ID,
  ClientId: COGNITO_CLIENT_ID
}

const userPool = new CognitoUserPool(poolData);

const CognitoAuth = {
  // Cognito Login
  login: async (username, password) => {
    const authenticationData = {
      Username: username,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          localStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
          localStorage.setItem('idToken', session.getIdToken().getJwtToken());

          // TODO: Move it to backend server
          localStorage.setItem('refreshToken', session.getRefreshToken().getToken());
          resolve(session);
        },
        onFailure: (error) => {
          reject('Incorrect username or password, please try again.');
        },
        newPasswordRequired: (userAttributes) => {
          userAttributes.new_password_challenge = true;
          resolve(userAttributes);
        }
      });
    });
  },

  // Cognito Logout
  logout: () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.signOut();
    }
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
  },

  // Is Authenticated
  isAuthenticated: () => {
    const cognitoUser = userPool.getCurrentUser();
    return cognitoUser !== null;
  },

  // current user
  currentUser: () => {
    const cognitoUser = userPool.getCurrentUser();
    return cognitoUser;
  },

  // New password challenge
  completeNewPasswordChallenge: async (username, tempPassword, newPassword) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: tempPassword,
    });
    await new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        newPasswordRequired: (userAttributes) => {
          cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
            onSuccess: (session) => {
              localStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
              localStorage.setItem('idToken', session.getIdToken().getJwtToken());

              // TODO: Move it to backend server
              localStorage.setItem('refreshToken', session.getRefreshToken().getToken());
              resolve(session);
            },
            onFailure: (error) => {
              reject(error);
            },
          });
        },
        onSuccess: resolve,
        onFailure: reject
      });
    });
  },

  // Change Password
  changePassword: async (username, oldPassword, newPassword) => {
    const authenticationData = {
      Username: username,
      Password: oldPassword
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    await new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: resolve,
        onFailure: reject
      });
    });

    await new Promise((resolve, reject) => {
      cognitoUser.changePassword(oldPassword, newPassword, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  },

  // Forgot Password
  forgotPassword: (username) => {
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
        cognitoUser.forgotPassword({
        onSuccess: resolve,
        onFailure: reject
      });
    });
  },

  // Reset Password
  resetPassword: (username, verificationCode, newPassword) => {
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: resolve,
        onFailure: reject
      });
    });
  }
}

// Cognito Current User
export function getCurrentCognitoUser() {
  const cognitoUser = userPool.getCurrentUser();
  return cognitoUser
}

export function getCognitoUserAttributes() {
  const cognitoUser = userPool.getCurrentUser();

  if (cognitoUser && cognitoUser.getSession) {
    return new Promise((resolve, reject) => {
      cognitoUser.getSession((error, session) => {
        if (error) {
          reject(error);
          return;
        }

        if (session.isValid()) {
          cognitoUser.getUserAttributes((attrError, attributes) => {
            if (attrError) {
              reject(attrError);
            } else {
              const attributeMap = {};
              attributes.forEach((attribute) => {
                attributeMap[attribute.getName()] = attribute.getValue();
              });
              resolve(attributeMap);
            }
          });
        } else {
          reject(new Error('User session is not valid'));
        }
      });

    });
  }

  return null;
}

export default CognitoAuth;
