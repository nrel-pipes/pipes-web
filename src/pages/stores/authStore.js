import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { CognitoUser, CognitoUserPool, AuthenticationDetails} from "amazon-cognito-identity-js"


const useAuthStore = create(
  persist((set) => ({
    currentUser: null,
    isLoggedIn: false,
    loginError: null,
    newPasswordChallenge: false,
    login: (username, password, pooldata) => {
      try {
        const userPool = new CognitoUserPool(pooldata);
        const authenticationData = {
          Username: username,
          Password: password
        };
        set({ isLoggedIn: true, loginError: null});
      } catch (error) {
        console.log(error);
        set({ isLoggedIn: false, loginError: error.message });
      }

      // const authenticationDetails = new AuthenticationDetails(authenticationData);
      // const userData = {
      //   Username: username,
      //   Pool: userPool
      // };
      // const cognitoUser = new CognitoUser(userData);
      // const promise = new Promise((resolve, reject) => {
      //   cognitoUser.authenticateUser(authenticationDetails, {
      //     onSuccess: (session) => {
      //       localStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
      //       localStorage.setItem('idToken', session.getIdToken().getJwtToken());

      //       // TODO: Move it to backend server
      //       localStorage.setItem('refreshToken', session.getRefreshToken().getToken());
      //       resolve(session);
      //     },
      //     onFailure: (e) => {
      //       reject('Incorrect username or password, please try again.');
      //     },
      //     newPasswordRequired: (userAttributes) => {
      //       userAttributes.new_password_challenge = true;
      //       resolve(userAttributes);
      //     }
      //   });
      // });

      // promise.then((result) => {
      //   if (
      //     result.hasOwnProperty("new_password_challenge") &&
      //     result.new_password_challenge === true
      //   ) {
      //     set({newPasswordChallenge: true});
      //   } else {
      //     set({isLoggedIn: true});
      //   }
      // })
      // .catch((e) => {
      //   set({error: e.message});
      // });
    },
    logout: () => {
      set({ currentUser: null, isLoggedIn: false, loginError: null})
    },

  }),
  {
    name: 'auth-store',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useAuthStore;
