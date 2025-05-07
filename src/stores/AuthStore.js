import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { jwtDecode } from 'jwt-decode';

import pipesConfig from '../configs/PipesConfig';

const useAuthStore = create(
  persist((set, get) => ({
    currentUser: null,

    challengeUsername: null,
    tempPassword: null,
    passwordResetUsername: null,

    getCognitoUser: () => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
      return userPool.getCurrentUser(); // This retrieves from localStorage, not an API call
    },

    getAccessToken: async () => {
      const cognitoUser = get().getCognitoUser();

      if (!cognitoUser) {
        return null;
      }

      try {
        const session = await new Promise((resolve, reject) => {
          cognitoUser.getSession((err, session) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(session);
          });
        });

        // Add additional validity check
        if (!session.isValid()) {
          return null;
        }

        return session.getAccessToken().getJwtToken();
      } catch (error) {
        console.error("Error getting access token:", error);
        return null;
      }
    },

    getIdToken: async () => {
      const cognitoUser = get().getCognitoUser();

      if (!cognitoUser) {
        return null;
      }

      try {
        const session = await new Promise((resolve, reject) => {
          cognitoUser.getSession((err, session) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(session);
          });
        });

        // Add additional validity check
        if (!session.isValid()) {
          return null;
        }

        return session.getIdToken().getJwtToken();
      } catch (error) {
        console.error("Error getting ID token:", error);
        return null;
      }
    },

    checkAuthStatus: () => {
      const cognitoUser = get().getCognitoUser();

      if (!cognitoUser) {
        return false;
      }

      try {
        // This would need to be modified to return a Promise instead of using callbacks
        return new Promise((resolve) => {
          cognitoUser.getSession((err, session) => {
            if (err || !session.isValid()) {
              resolve(false);
              return;
            }

            try {
              const idToken = session.getIdToken().getJwtToken();
              const { exp, iss } = jwtDecode(idToken);

              // Check issuer
              const parts = iss.split('/');
              const issId = parts[parts.length - 1];
              const userPoolId = pipesConfig.poolData.UserPoolId;

              if (issId !== userPoolId) {
                resolve(false);
                return;
              }

              // Check expiration
              const now = Math.floor(Date.now() / 1000);
              if (exp < now) {
                resolve(false);
                return;
              }

              resolve(true);
            } catch (error) {
              resolve(false);
            }
          });
        });
      } catch (error) {
        return Promise.resolve(false);
      }
    },

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
        set({ challengeUsername: username, tempPassword: password });
      }

      return response;
    },

    logout: () => {
      const cognitoUser = get().getCognitoUser();
      if (cognitoUser !== null) {
        cognitoUser.signOut();
        set({
          challengeUsername: null,
          tempPassword: null,
          passwordResetUsername: null,
          currentUser: null
        });
      }
    },

    completeNewPasswordChallenge: async (username, tempPassword, newPassword) => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
      const userData = {
        Username: username,
        Pool: userPool
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
                set({ challengeUsername: null, tempPassword: null });
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

    forgotPassword: async (username) => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
      const userData = {
        Username: username,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);

      return new Promise(
        (resolve, reject) => {
          cognitoUser.forgotPassword({
            onSuccess: (session) => {
              set({ passwordResetUsername: username });
              resolve(session);
            },
            onFailure: reject
          });
        });
    },

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

    validateToken: async () => {
      try {
        const cognitoUser = get().getCognitoUser();

        if (!cognitoUser) {
          return;
        }

        cognitoUser.getSession((err, session) => {
          if (err || !session.isValid()) {
            return;
          }

          try {
            const idToken = session.getIdToken().getJwtToken();
            const { exp, iss } = jwtDecode(idToken);

            // Check issuer
            const parts = iss.split('/');
            const issId = parts[parts.length - 1];
            const userPoolId = pipesConfig.poolData.UserPoolId;

            if (issId !== userPoolId) {
              return;
            }

            // Check expiration
            const now = Math.floor(Date.now() / 1000);
            if (exp < now) {
              return;
            }
          } catch (error) {
          }
        });
      } catch (error) {
      }
    },

    setCurrentUser: (userData) => {
      set({ currentUser: userData });
    },
  }), {
    name: 'Pipes.Auth.Store',
    storage: createJSONStorage(() => localStorage),
    // Only persist these specific keys
    partialize: (state) => ({
      challengeUsername: state.challengeUsername,
      tempPassword: state.tempPassword,
      passwordResetUsername: state.passwordResetUsername,
      currentUser: state.currentUser
    })
  })
);

export default useAuthStore;
