import { create } from 'zustand';
import { CognitoUser, CognitoUserPool, AuthenticationDetails} from "amazon-cognito-identity-js"


const useAuthStore = create((get, set) => ({
  currentUser: null,
  isLoggedIn: false,
  loginError: null,
  newPasswordChallenge: false,
  login: async (username, password, poolData) => {

    try {
      console.log("================================================", poolData);
      const userPool = CognitoUserPool(poolData);
      console.log("================================================", userPool);
      const authenticationData = {
        Username: username,
        Password: password
      };
      set({ isLoggedIn: true})

    } catch (error) {
      console.log(error)
      set({ loginError: error.message });
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
    set({ user: null, isLoggedIn: false, error: null})
  },

}));

export default useAuthStore;
