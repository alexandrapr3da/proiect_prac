
const path = require('path');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    url: require.resolve('url/'),
    assert: require.resolve('assert/'),
    zlib: require.resolve('browserify-zlib'),
    util: require.resolve('util/'),
  };
  return config;
};
