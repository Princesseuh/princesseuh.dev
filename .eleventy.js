const { DateTime } = require("luxon");
const fs = require('fs')

const HTMLMinifier = require('html-minifier-terser').minify;
const csso = require('csso');

const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pluginTOC = require('eleventy-plugin-toc')

const AssetManager = require('@11ty/eleventy-assets')

const postcss = require('postcss');
const postcssNested = require('postcss-nested');
const postcssImport = require('postcss-import');
const postcssCSSVariables = require('postcss-css-variables');

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const typographyPlugin = require("@jamshop/eleventy-plugin-typography");

function getCssFilePath(componentName) {
  return `theme/${componentName}.css`;
}

module.exports = function (config) {
  let cssManager = new AssetManager.InlineCodeManager();

  config.addNunjucksAsyncShortcode("usingCSSComponent", async function(componentName) {
    if (!cssManager.hasComponentCode(componentName)) {
      var cssPath = getCssFilePath(componentName)

      let componentCss = fs.readFileSync(cssPath, { encoding: "UTF-8" });

      var result = await processCSS(componentCss, cssPath);
      cssManager.addComponentCode(componentName, result);
    }

    cssManager.addComponentForUrl(componentName, this.page.url);

    return "";
  })

  config.addFilter("getCss", (url) => {
    return cssManager.getCodeForUrl(url);
  });

  config.setLibrary(
    'md',
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
      .use(markdownItAnchor, {
        permalink: true,
        permalinkClass: 'anchor-link',
        permalinkSymbol: '#',
        level: [1, 2, 3, 4]
      })
  )
  config.addPlugin(pluginTOC)

  config.addNunjucksFilter("featured", arr => arr.filter(e => e.data.featured));

  config.addWatchTarget("./theme/*.css");
  config.addWatchTarget("articles");

  config.setDataDeepMerge(true);

  config.on("beforeWatch", () => {
    cssManager.resetComponentCode();
  });

  // TODO: Implement Youtube shortcode
  config.addShortcode('youtube', function(id) {return `${id}`})

  config.addFilter("readableDate", function(date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('LLL dd, yyyy');
  })

  config.addFilter("htmlDateString", function (date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  })

  config.addPassthroughCopy("articles/**/*.png");
  config.addPassthroughCopy("projects/**/*.png");
  config.addPassthroughCopy("theme/*.js");

  // Minify HTML
  config.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      let minified = HTMLMinifier(content, {
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        // removeEmptyElements: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
      })
      return minified
    }
    return content
  })

  config.addTransform("css", async function(content, outputPath) {
    if (outputPath.endsWith("prin.css")) {
      return await processCSS(content, "./theme/prin.css")
    }

    return content;
  });

  config.addPlugin(syntaxHighlight);
  config.addPlugin(typographyPlugin);

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  }
};

async function processCSS(content, from, to = undefined) {
  return await postcss()
    .use(postcssImport())
    .use(postcssNested())
    .use(postcssCSSVariables())
    .process(content, {
      from: from,
      to: to
    }).then(function (result) {
      return csso.minify(result.css, {
        comments: false
      }).css;
    })
}
