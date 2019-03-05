'use strict';

const cfActivity = require('@adenin/cf-activity');
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    api.initialize(activity);

    //sending wrong token after initial authorization returns success
    //might be because I am getting error:
    //response.body.response.errors.code => 7074
    //"API is unavailable for your pricing plan. Please upgrade to access"
    const response = await api('/announcement/getAllAnnouncement?startIdx=1');

    if (!api.isResponseOk(activity, response)) {
      return;
    }

    activity.Response.Data = {
      success: response && response.statusCode === 200
    };
  } catch (error) {
    cfActivity.handleError(activity, error);
    activity.Response.Data.success = false;
  }
};
