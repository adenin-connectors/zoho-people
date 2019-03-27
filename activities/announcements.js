'use strict';
const api = require('./common/api');

module.exports = async function (activity) {

  try {
    var pagination = Activity.pagination();
    let startIndex = pagination.page*10;
    //*startIdx - the starting index to be given - 10 records from the given starting index will be fetched at a time; 
    //starting index should be 1 or greater than 1
    const response = await api(`/announcement/getAllAnnouncement?startIdx=1&startIdx=${startIndex}`);

    if (Activity.isErrorResponse(response)) return;

    activity.Response.Data = convertResponse(response);
  } catch (error) {
    Activity.handleError(error);
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