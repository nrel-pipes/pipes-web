import { create } from 'zustand';


const devConfig = {
  env: 'dev',
  cognito_user_pool_id: 'us-west-2_RzEL2COOq',
  cognito_client_id: 'clfpli1avt6eil03ovr11qdpi'
}

const stageConfig = {
  env: 'stage',
  cognito_user_pool_id: 'us-west-2_RzEL2COOq',
  cognito_client_id: 'clfpli1avt6eil03ovr11qdpi'
}

const prodConfig = {
  env: 'prod',
  cognito_user_pool_id: 'us-west-2_QIFK6524E',
  cognito_client_id: '539o71b6rh0ua124ro8q3bv39s'
}

const otherConfig = {
  env: 'other',
  cognito_user_pool_id: 'us-west-2_TvEJ1biz0',
  cognito_client_id: '6n5co9eh7bab4a21egr95ds3r8'
}


let config;
if (process.env.REACT_APP_ENV === 'prod') {
  config = prodConfig;
} else if (process.env.REACT_APP_ENV === 'stage') {
  config = stageConfig;
} else if (process.env.REACT_APP_ENV === 'dev') {
  config = devConfig;
} else {
  config = otherConfig;
}


const useConfigStore = create(() => ({
  env: config.env,
  poolData: {
    UserPoolId: config.cognito_user_pool_id,
    ClientId: config.cognito_client_id
  }
}));

export default useConfigStore;
