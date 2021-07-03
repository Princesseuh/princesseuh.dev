const markdownIt = require('markdown-it');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

module.exports = {
  jsonify(content) {
    return JSON.stringify(content);
  },

  markdown(content) {
    const md = new markdownIt({ ty: true });
    return md.renderInline(content);
  },

  readableDate(date) {
    return dayjs(date).utc().format('MMM DD, YYYY');
  },

  readableDatetime(date) {
    return dayjs(date).utc().format('MMM DD, YYYY [at] HH:mm:ss');
  },

  htmlDateString(date) {
    // return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  },

  utcDate(date) {
    return dayjs(date).utc().format();
  },

  featured(arr) {
    return arr.filter((e) => e.data.featured);
  },
};
