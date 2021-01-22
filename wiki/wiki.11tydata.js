const { execSync } = require('child_process')

module.exports = {
  layout: "layouts/wiki.njk",
  tags: "wiki",
  eleventyComputed: {
    lastModified: (data) => {
      let result = execSync(`git log -1 --pretty="format:%ci" ${data.page.inputPath}`)
      return result
    }
  }
}
