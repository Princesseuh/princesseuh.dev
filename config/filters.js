const markdownIt = require('markdown-it')
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

module.exports = {
  jsonify: function(content) {
    return JSON.stringify(content);
  },

  markdown: function(content) {
    var md = new markdownIt({ ty: true });
    return md.renderInline(content);
  },

  readableDate: function (date) {
    return dayjs(date).utc().format('MMM DD, YYYY');
  },

  readableDatetime: function (date) {
    return dayjs(date).utc().format("MMM DD, YYYY [at] HH:mm:ss");
  },

  htmlDateString: function (date) {
    //return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  },

  utcDate: function(date) {
    return dayjs(date).utc().format()
  },

  featured: function (arr) {
    return arr.filter(e => e.data.featured)
  }
}
