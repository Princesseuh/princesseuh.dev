const { execSync } = require('child_process');
const dayjs = require('dayjs');

module.exports = {
  layout: 'layouts/wiki.njk',
  tags: 'wiki',
  eleventyComputed: {
    // Eleventy features a way to get the last time a file was modified already, however it gets it
    // from stat (ctimems), so it get overwritten when deployed on another server, getting it from git is safer
    // TODO: Cache this or disable outside of prod. Shelling out to git can be expensive
    lastModified: (data) => {
      const isoDate = execSync(`git log -1 --date=iso --pretty="format:%cI" ${data.page.inputPath}`);
      const result = dayjs(isoDate);

      return result.toDate();
    },
  },
};
