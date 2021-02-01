const { execSync } = require('child_process')
const { DateTime } = require("luxon");

module.exports = {
  layout: "layouts/wiki.njk",
  tags: "wiki",
  eleventyComputed: {
    // Eleventy features a way to get the last time a file was modified already, however it gets it
    // from stat (ctimems), so it get overwritten when deployed on another server, getting it from git is safer
    lastModified: (data) => {
      let isoDate = execSync(`git log -1 --date=iso-local --pretty="format:%cI" ${data.page.inputPath}`)
      let result = DateTime.fromISO(isoDate)

      return result.toJSDate()
    }
  }
}
