'use strict';

const cfActivity = require('@adenin/cf-activity');
const api = require('./common/api');

module.exports = async function (activity) {

  try {
    api.initialize(activity);

    const response = await api(`/announcement/getAllAnnouncement?authtoken=${activity.Context.connector.custom1}&startIdx=1`);

    if (!cfActivity.isResponseOk(activity, response)) {
      return;
    }
    // convert response to items[]
    activity.Response.Data = api.convertResponse(response);
  } catch (error) {

    cfActivity.handleError(error, activity);
  }
};