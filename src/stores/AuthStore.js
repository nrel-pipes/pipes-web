import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { jwtDecode } from 'jwt-decode';

import pipesConfig from '../configs/PipesConfig';



// Helper function to generate a random string (like the image)

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

    createCognitoUser: async (email) => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);

      // Generate a secure random password that meets Cognito requirements
      const generateSecurePassword = (length = 16) => {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

        const randomValues = new Uint8Array(length);
        window.crypto.getRandomValues(randomValues);

        // Start with one of each required character type
        let password = '';
        password += uppercaseChars[randomValues[0] % uppercaseChars.length];
        password += lowercaseChars[randomValues[1] % lowercaseChars.length];
        password += numberChars[randomValues[2] % numberChars.length];
        password += specialChars[randomValues[3] % specialChars.length];

        // Fill the rest with random characters
        const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
        for (let i = 4; i < length; i++) {
          password += allChars[randomValues[i] % allChars.length];
        }

        // Shuffle the password
        const passwordArray = password.split('');
        for (let i = passwordArray.length - 1; i > 0; i--) {
          const j = Math.floor((randomValues[i] / 255) * (i + 1));
          [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
        }

        return passwordArray.join('');
      };

      const generatedPassword = generateSecurePassword();

      // Store the generated password in the store temporarily
      set({ tempPassword: generatedPassword });

      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
      ];

      console.log('Creating or updating Cognito User with email:', email);

      try {
        return await new Promise((resolve, reject) => {
          userPool.signUp(email, generatedPassword, attributeList, null, (err, result) => {
            if (err) {
              // Handle case where user already exists
              if (err.code === 'UsernameExistsException') {
                console.log('User already exists, generating a new verification code...');

                // Create a CognitoUser object for the existing user
                const userData = {
                  Username: email,
                  Pool: userPool
                };

                const cognitoUser = new CognitoUser(userData);

                // Force generation of a new confirmation code by using resendConfirmationCode
                cognitoUser.resendConfirmationCode((resendErr, resendResult) => {
                  if (resendErr) {
                    console.error('Error generating new verification code:', resendErr);

                    // Check for specific errors
                    if (resendErr.code === 'LimitExceededException') {
                      reject(new Error('Too many attempts. Please try again after some time.'));
                    } else if (resendErr.code === 'UserConfirmedException') {
                      reject(new Error('This account is already verified. Please login.'));
                    } else {
                      reject(resendErr);
                    }
                  } else {
                    console.log('New verification code generated successfully:', resendResult);

                    // Store the username for confirmation step
                    set({ challengeUsername: email });

                    resolve({
                      result: resendResult,
                      message: 'New verification code has been sent to your email.'
                    });
                  }
                });
              } else {
                console.error('Cognito UserPool Sign-up Error:', err);
                reject(err);
              }
            } else {
              console.log('Cognito UserPool Sign-up Success:', result);

              // Store the username for confirmation step
              set({ challengeUsername: email });

              resolve({
                result,
                message: 'Please check your email for a verification code to confirm your account.'
              });
            }
          });
        });
      } catch (error) {
        console.error('Error in createCognitoUser:', error);
        throw error;
      }
    },

    // Add a new function to verify the code from email
    confirmSignUp: async (username, code, password) => {
      const userPool = new CognitoUserPool(pipesConfig.poolData);
      const userData = {
        Username: username,
        Pool: userPool
      };

      const cognitoUser = new CognitoUser(userData);

      return new Promise((resolve, reject) => {
        // First confirm the registration with the verification code
        cognitoUser.confirmRegistration(code, true, async (err, result) => {
          if (err) {
            console.error('Confirmation error:', err);
            reject(err);
            return;
          }

          console.log('Confirmation successful:', result);

          // If password is provided, we need to set it
          if (password) {
            try {
              // Get the temporary password that was generated during sign-up
              // This should be stored in the zustand store
              const tempPassword = get().tempPassword;

              if (!tempPassword) {
                console.error('No temporary password found for user');
                // Even though no temp password was found, the account is confirmed
                resolve({
                  result,
                  message: 'Account confirmed, but could not set the password. Please use forgot password.'
                });
                return;
              }

              console.log('Authenticating with temporary password for:', username);
              const authenticationData = {
                Username: username,
                Password: tempPassword, // Use the temporary password for initial authentication
              };

              const authenticationDetails = new AuthenticationDetails(authenticationData);

              await new Promise((authResolve, authReject) => {
                cognitoUser.authenticateUser(authenticationDetails, {
                  onSuccess: (session) => {
                    console.log('Successfully authenticated with temp password, now changing password');

                    // Now we can change the password
                    cognitoUser.changePassword(
                      tempPassword,  // old password (temporary)
                      password,      // new password (user-provided)
                      (changeErr, changeResult) => {
                        if (changeErr) {
                          console.error('Error changing password:', changeErr);
                          authReject(changeErr);
                        } else {
                          console.log('Password changed successfully');
                          // Clear the temporary password
                          set({ tempPassword: null });
                          authResolve(changeResult);
                        }
                      }
                    );
                  },
                  onFailure: (authErr) => {
                    console.error('Authentication with temp password failed:', authErr);
                    authReject(authErr);
                  },
                  newPasswordRequired: (userAttributes) => {
                    // This is an alternative path for setting the initial password
                    console.log('New password required flow triggered');
                    delete userAttributes.email_verified;

                    cognitoUser.completeNewPasswordChallenge(
                      password,        // new password
                      userAttributes,  // user attributes
                      {
                        onSuccess: (session) => {
                          console.log('Password set via completeNewPasswordChallenge');
                          // Clear the temporary password
                          set({ tempPassword: null });
                          authResolve(session);
                        },
                        onFailure: (npErr) => {
                          console.error('Error in completeNewPasswordChallenge:', npErr);
                          authReject(npErr);
                        }
                      }
                    );
                  }
                });
              });

              resolve({
                result,
                message: 'Account confirmed and password set successfully.'
              });
            } catch (authError) {
              console.error('Error setting password after confirmation:', authError);
              // We'll still resolve since the account was confirmed
              resolve({
                result,
                message: 'Account confirmed, but there was an issue setting your password. Please use password reset.'
              });
            }
          } else {
            // No password provided, just resolve with the confirmation result
            resolve(result);
          }
        });
      });
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

      // Make sure we have valid inputs
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      const authenticationDetails = new AuthenticationDetails(authenticationData);
      const userData = {
        Username: username,
        Pool: userPool
      };
      const cognitoUser = new CognitoUser(userData);

      console.log("Attempting login for:", username);

      const response = await new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (session) => {
            console.log("Login successful");
            resolve(session);
          },
          onFailure: (err) => {
            // Extract more detailed error information
            console.error("Login error:", err);

            // Check for specific error types
            if (err.code === 'UserNotConfirmedException') {
              reject('This account has not been verified. Please check your email for a verification code.');
            } else if (err.code === 'PasswordResetRequiredException') {
              reject('Password reset is required. Please use the forgot password feature.');
            } else if (err.code === 'NotAuthorizedException') {
              reject('Incorrect username or password, please try again.');
            } else if (err.code === 'UserNotFoundException') {
              reject('No account found with this username. Please check your spelling or create a new account.');
            } else {
              // For other errors, return the specific message
              reject(err.message || 'Login failed. Please try again.');
            }
          },
          newPasswordRequired: (userAttributes) => {
            console.log("New password required");
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
