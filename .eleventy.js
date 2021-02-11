const { DateTime } = require("luxon");
const fs = require('fs')

const JSMinifier = require('terser');
const HTMLMinifier = require('html-minifier-terser').minify;
const csso = require('csso');

const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pluginTOC = require('eleventy-plugin-toc')
const pluginFootnotes = require('eleventy-plugin-footnotes')

const AssetManager = require('@11ty/eleventy-assets')
const Image = require("@11ty/eleventy-img");

const postcss = require('postcss');
const postcssNested = require('postcss-nested');
const postcssImport = require('postcss-import');
const postcssCSSVariables = require('postcss-css-variables');

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const typographyPlugin = require("@jamshop/eleventy-plugin-typography");
const { plugin } = require("postcss");

function getCssFilePath(componentName) {
  return `theme/${componentName}.css`;
}

async function indexCoverShortcode(src, alt, sizes) {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let metadata = await Image(src, {
    widths: [380, 600],
    formats: ["avif", "webp", "jpeg"],
    outputDir: './_site/img/'
  });

  let lowsrc = metadata.jpeg[0];

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
  }).join("\n")}
      <img
        src="${lowsrc.url}"
        width="377"
        height="180"
        alt="${alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

async function imageShortcode(data) {
  let metadata = await Image(data.src, {
    widths: [null],
    formats: ["avif", "webp", "jpeg"],
    outputDir: './_site/img/'
  });

  let imageAttributes = {
    alt: data.alt,
    sizes: data.sizes,
    loading: "lazy",
    decoding: "async",
  };


  let html = Image.generateHTML(metadata, imageAttributes);

  var md = new markdownIt({ typographer: true });
  let captionHtml = data.caption ? `<figcaption>${md.renderInline(data.caption)}</figcaption>` : ''
  return `<figure class="${data.class}">${html}${captionHtml}</figure>`
}

function blockShortcode(content, title) {
  var md = new markdownIt({ typographer: true });
  return `<div class="block-note"><span class="block-title">${md.renderInline(title)}</span>${md.render(content)}</div>`
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

  config.addFilter("htmlmin", (content) => {
    return minifyHTML(content);
  })

  config.addNunjucksAsyncFilter("cssmin", function(content, callback) {
    processCSS(content).then(
      (result) => {
        callback(null, result)
      }
    )
  })

  config.addCollection("latestWiki", function (collectionApi) {
    return collectionApi.getFilteredByTag("wiki")
    .filter(function(item) {
      return item.url !== false
    })
    .sort(function (a, b) {
      return b.lastModified - a.lastModified;
    });
  });

  config.addCollection("tagListPosts", collection => {
    const tagsSet = new Set();
    collection.getFilteredByTag("post").forEach(item => {
      if (!item.data.tags) return;
      item.data.tags
        .filter(tag => !['post', 'all'].includes(tag))
        .forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  });

  config.addFilter("markdown", (content) => {
    var md = new markdownIt({ typographer: true });
    return md.renderInline(content);
  })

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
  config.addPlugin(pluginFootnotes)

  config.addPlugin(eleventyNavigationPlugin);
  config.addNunjucksFilter("featured", arr => arr.filter(e => e.data.featured));

  config.addWatchTarget("./theme/*.css");
  config.addWatchTarget("./theme/spa.js");
  config.addWatchTarget("**/*.md");

  config.setDataDeepMerge(true);

  config.on("beforeWatch", () => {
    cssManager.resetComponentCode();
  });

  config.addNunjucksAsyncShortcode("image", imageShortcode);
  config.addNunjucksAsyncShortcode("cover", indexCoverShortcode);

  config.addPairedNunjucksShortcode("note", blockShortcode);

  // TODO: Implement Youtube shortcode
  config.addShortcode('youtube', function(id) {return `${id}`})

  config.addFilter("readableDate", function(date) {
    return DateTime.fromJSDate(date).toFormat('LLL dd, yyyy');
  })

  config.addFilter("readableDatetime", function(date) {
    return DateTime.fromJSDate(date).toFormat("LLL dd, yyyy 'at' HH:mm:ss");
  })

  config.addFilter("htmlDateString", function (date) {
    return DateTime.fromJSDate(date).toFormat('yyyy-LL-dd');
  })

  // Minify HTML
  config.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = minifyHTML(content)
      return minified
    }
    return content;
  })

  config.addTransform("css", async function(content, outputPath) {
    if (outputPath && outputPath.endsWith("prin.css")) {
      return await processCSS(content, "./theme/prin.css")
    }

    return content;
  });

  config.addTransform("jsmin", async function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".js")) {
      var result = await JSMinifier.minify(content);
      return result.code;
    }

    return content;
  });

  config.addTransform("jsonmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".json")) {
      return JSON.stringify(JSON.parse(content))
    }

    return content;
  })

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

function minifyHTML(content) {
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

  return minified;
}
