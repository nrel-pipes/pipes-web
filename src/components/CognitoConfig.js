
// Auth URL: https://c2c-dev-userpool.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=6n5co9eh7bab4a21egr95ds3r8&redirect_uri=http://localhost:3000
let COGNITO_USER_POOL_ID;
let COGNITO_CLIENT_ID;

if (process.env.REACT_APP_ENV === "prod") {
  COGNITO_USER_POOL_ID = "us-west-2_QIFK6524E";
} else if (process.env.REACT_APP_ENV === "stage"){
  COGNITO_USER_POOL_ID = ""; // No stage setup
} else if (process.env.REACT_APP_ENV === "dev") {
  COGNITO_USER_POOL_ID = "us-west-2_RzEL2COOq";
} else {
  COGNITO_USER_POOL_ID = "us-west-2_TvEJ1biz0";
}

if (process.env.REACT_APP_ENV === "prod") {
  COGNITO_CLIENT_ID = "539o71b6rh0ua124ro8q3bv39s";
} else if (process.env.REACT_APP_ENV === "stage"){
  COGNITO_CLIENT_ID = "";// No stage setup
} else if (process.env.REACT_APP_ENV === "dev") {
  COGNITO_CLIENT_ID = "clfpli1avt6eil03ovr11qdpi";
} else {
  COGNITO_CLIENT_ID = "6n5co9eh7bab4a21egr95ds3r8";
}

export { COGNITO_USER_POOL_ID };
export { COGNITO_CLIENT_ID };
