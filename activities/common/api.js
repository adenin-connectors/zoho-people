'use strict';

const got = require('got');
const HttpAgent = require('agentkeepalive');
const HttpsAgent = HttpAgent.HttpsAgent;

let _activity = null;

function api(path, opts) {
  if (typeof path !== 'string') {
    return Promise.reject(new TypeError(`Expected \`path\` to be a string, got ${typeof path}`));
  }

  opts = Object.assign({
    json: true,
    token: _activity.Context.connector.token,
    endpoint: 'https://people.zoho.com/people/api',
    agent: {
      http: new HttpAgent(),
      https: new HttpsAgent()
    }
  }, opts);

  opts.headers = Object.assign({
    accept: 'application/json',
    'user-agent': 'adenin Digital Assistant Connector, https://www.adenin.com/digital-assistant'
  }, opts.headers);

  if (opts.token) opts.headers.Authorization = `token ${opts.token}`;

  const url = /^http(s)\:\/\/?/.test(path) && opts.endpoint ? path : opts.endpoint + path + `&authtoken=${_activity.Context.connector.custom1}`;

  if (opts.stream) return got.stream(url, opts);

  return got(url, opts).catch((err) => {
    throw err;
  });
}

const helpers = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'delete'
];

api.initialize = (activity) => {
  _activity = activity;
};

api.stream = (url, opts) => api(url, Object.assign({}, opts, {
  json: false,
  stream: true
}));

for (const x of helpers) {
  const method = x.toUpperCase();
  api[x] = (url, opts) => api(url, Object.assign({}, opts, { method }));
  api.stream[x] = (url, opts) => api.stream(url, Object.assign({}, opts, { method }));
}

//** Checks response for statusCode200 && response.body.response.errors.code == 7074*/
api.isResponseOk = function (response) {
  if (response && response.statusCode === 200 && response.body.response.result) {
    return true;
  }

  if (response.statusCode == 200) response.statusCode = 500;


  _activity.Response.ErrorCode = response.statusCode || 500;
  _activity.Response.Data = {
    ErrorText: `request failed with statusCode ${response.body.response.errors.code}: ${response.body.response.errors.message}`
  };

  logger.error(_activity.Response.Data.ErrorText);

  return false;
};

module.exports = api;
