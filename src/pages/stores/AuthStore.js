import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { CognitoUser, CognitoUserPool, AuthenticationDetails} from "amazon-cognito-identity-js"
import { jwtDecode } from 'jwt-decode';

import pipesConfig from '../configs/PipesConfig'


const useAuthStore = create(
  persist((set) => ({
    // Attributes
    currentUser: null,
    isLoggedIn: false,
    challengeUsername: null,
    tempPassword: null,
    passwordResetUsername: null,
    accessToken: null,
    idToken: null,

    // login method
    login: async (username, password) => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
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

      const response = await new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (session) => {
            set({accessToken: session.getAccessToken().getJwtToken()});
            set({idToken: session.getIdToken().getJwtToken()});
            set({isLoggedIn: true});
            set({currentUser: cognitoUser});
            resolve(session);
          },
          onFailure: () => {
            reject('Incorrect username or password, please try again.');
          },
          newPasswordRequired: (userAttributes) => {
            userAttributes.newPasswordChallenge = true;
            resolve(userAttributes);
          }
        });
      });

      if (response.hasOwnProperty("newPasswordChallenge") && response.newPasswordChallenge === true) {
        set({challengeUsername: username, tempPassword: password});
      }

      return response;
    },

    // lougout method
    logout: () => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
      const currentUser = userPool.getCurrentUser();
      if (currentUser !== null) {
        currentUser.signOut();
        set({
          currentUser: null,
          isLoggedIn: false,
          accessToken: null,
          idToken: null,
          challengeUsername: null,
          tempPassword: null,
          passwordResetUsername: null
        });
      }
    },

    // complete new password challenge
    completeNewPasswordChallenge: async (username, tempPassword, newPassword) => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
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
                set({challengeUsername: null, tempPassword: null});
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

    // change password
    changePassword: async (username, oldPassword, newPassword) => {
      const authenticationData = {
        Username: username,
        Password: oldPassword
      };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
      const userPool = new CognitoUserPool(pipesConfig.poolData);
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

    // forget password
    forgotPassword: async (username) => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
      const userData = {
        Username: username,
        Pool: userPool
      };
      const cognitoUser = new CognitoUser(userData);

      return new Promise(
        (resolve, reject) => {
          cognitoUser.forgotPassword({
          onSuccess: (session) => {
            set({passwordResetUsername: username});
            resolve(session);
          },
          onFailure: reject
        });
      });
    },

    // reset password
    resetPassword: async (username, verificationCode, newPassword) => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
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
    },

    // Validate if token expired
    validateToken: async (token) => {
      try {
        const isTokenExpired = (token) => {
          const { exp } = jwtDecode(token);
          const now = Math.floor(Date.now() / 1000);
          return exp < now;
        };

        // Check if the token is expired
        if (isTokenExpired(token)) {
          set({ isLoggedIn: false});
        }

      } catch (error) {
        set({ isLoggedIn: false });
        console.error('Token validatation failed, please re-login', error);
      }
    }

  }),
  {
    name: 'AuthStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useAuthStore;
