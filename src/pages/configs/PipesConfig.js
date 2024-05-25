
const devConfig = {
  env: 'dev',
  poolData: {
    UserPoolId: 'us-west-2_RzEL2COOq',
    ClientId: 'clfpli1avt6eil03ovr11qdpi',
  },
  apiOrigin: 'https://pipes-api-dev.nrel.gov'
}

const stageConfig = {
  env: 'stage',
  poolData: {
    UserPoolId: 'us-west-2_RzEL2COOq',
    ClientId: 'clfpli1avt6eil03ovr11qdpi',
  },
  apiOrigin: 'https://pipes-api-stage.nrel.gov'
}

const prodConfig = {
  env: 'prod',
  pollData: {
    UserPoolId: 'us-west-2_QIFK6524E',
    ClientId: '539o71b6rh0ua124ro8q3bv39s',
  },
  apiOrigin: 'https://pipes-api.nrel.gov'
}

const otherConfig = {
  env: 'other',
  poolData: {
    UserPoolId: 'us-west-2_TvEJ1biz0',
    ClientId: '6n5co9eh7bab4a21egr95ds3r8',
  },
  apiOrigin: 'http://0.0.0.0:8080'
}


var pipesConfig;

if (process.env.REACT_APP_ENV === 'prod') {
  pipesConfig = prodConfig;
} else if (process.env.REACT_APP_ENV === 'stage') {
  pipesConfig = stageConfig;
} else if (process.env.REACT_APP_ENV === 'dev') {
  pipesConfig = devConfig;
} else {
  pipesConfig = otherConfig;
}

export default pipesConfig;
