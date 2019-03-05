'use strict';

const cfActivity = require('@adenin/cf-activity');
const api = require('./common/api');

module.exports = async function (activity) {

  try {
    api.initialize(activity);
    const response = await api(`/announcement/getAllAnnouncement?startIdx=1`);

    if (!api.isResponseOk(activity, response)) {
      return;
    }

    activity.Response.Data = convertResponse(response);
  } catch (error) {

    cfActivity.handleError(activity, error);
  }
};

//**maps response data to items */
function convertResponse(response) {
  let items = [];
  let announcements = response.body.response.result.resultData.announcementList;

  for (let i = 0; i < announcements.length; i++) {
    let raw = announcements[i];
    let item = {
      id: raw.announcementId,
      title: raw.subject,
      description: raw.message,
      link: `https://people.zoho.com/myportalhome/zp#organization/announcements/announcement-annId:${raw.announcementId}`,
      raw: raw
    };
    items.push(item);
  }

  return { items: items };
}