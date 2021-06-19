const fs = require('fs');
const path = require('path');
const shortHash = require('shorthash2')

const filters = require('./config/filters.js')

const HTMLMinifier = require('html-minifier-terser').minify;
const csso = require('csso');

const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const AssetManager = require('@11ty/eleventy-assets')
const Image = require("@11ty/eleventy-img");

const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginTypography= require("@jamshop/eleventy-plugin-typography");
const pluginTOC = require('eleventy-plugin-nesting-toc')
const pluginFootnotes = require('eleventy-plugin-footnotes')
const pluginESbuild = require("@jamshop/eleventy-plugin-esbuild");

function getCssFilePath(componentName) {
  return `theme/css/${componentName}.css`;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const imageOptions = {
  outputDir: './_site/img/',
  formats: ['avif', 'webp', 'jpeg'],
  filenameFormat: (id, src, width, format) => {
    const extension = path.extname(src);
    const name = path.basename(src, extension);

    const stats = fs.statSync(src);

    const hash = shortHash(`${src}|${stats.size}`);

    return `${name}-${hash}-${width}w.${format}`;
  },
};

async function indexCoverShortcode(src, alt, sizes) {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on responsive image from: ${src}`);
  }

  const options = {
    widths: [380, 600],
    ...imageOptions
  }

  const stats = Image.statsSync(src, options);

  /** Creating a flat array of all the output paths from the stats object. */
  const outputPaths = Object.keys(stats).reduce((acc, key) => {
    return [
      ...acc,
      ...stats[key].map((resource) => {
        return resource.outputPath;
      }),
    ];
  }, []);

  /** Checking if all output files exists. */
  let hasImageBeenOptimized = true;
  for (const outputPath of outputPaths) {
    if (!fs.existsSync(path.resolve(__dirname, outputPath))) {
      hasImageBeenOptimized = false;
    }
  }

  // Process the image if doesn't exist
  if (!hasImageBeenOptimized) {
    await Image(src, options)
  }

  return `<picture>
    ${Object.values(stats).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
  }).join("\n")}
      <img
        class="object-cover object-top rounded-sm"
        src="${stats.jpeg[0].url}"
        width="377"
        height="180"
        alt="${alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

async function catalogueCoverShortcode(data) {
  if (data.alt === undefined) {
    throw new Error(`Missing \`alt\` on responsive image from: ${data.src}`);
  }

  const options = {
    widths: [300],
    ...imageOptions
  }

  const stats = Image.statsSync(data.src, options);

  /** Creating a flat array of all the output paths from the stats object. */
  const outputPaths = Object.keys(stats).reduce((acc, key) => {
    return [
      ...acc,
      ...stats[key].map((resource) => {
        return resource.outputPath;
      }),
    ];
  }, []);

  /** Checking if all output files exists. */
  let hasImageBeenOptimized = true;
  for (const outputPath of outputPaths) {
    if (!fs.existsSync(path.resolve(__dirname, outputPath))) {
      hasImageBeenOptimized = false;
    }
  }

  // Process the image if doesn't exist
  if (!hasImageBeenOptimized) {
    await Image(data.src, options)
  }

  let pictureClass = data.class ? `class="${data.class}"` : ''
  let result = `<picture ${pictureClass}>
    ${Object.values(stats).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}">`;
  }).join("\n")}
      <img
        class="max-w-[200px] max-h-[300px]"
        src="${stats.jpeg[0].url}"
        alt="${data.alt}"
        width="200"
        height="300"
        loading="lazy"
        decoding="async">
    </picture>`;

    if (data.escape) {
      return minifyHTML(escapeHtml(result).replace(/(\r\n|\n|\r)/gm, ""));
    }
    return result
}

async function imageShortcode(data) {

  const options = {
    widths: [null],
    sharpWebpOptions: {
      quality: 90,
    },
    sharpAvifOptions: {
      quality: 90,
    },
    ...imageOptions
  }

  const stats = Image.statsSync(data.src, options);

  /** Creating a flat array of all the output paths from the stats object. */
  const outputPaths = Object.keys(stats).reduce((acc, key) => {
    return [
      ...acc,
      ...stats[key].map((resource) => {
        return resource.outputPath;
      }),
    ];
  }, []);

  /** Checking if all output files exists. */
  let hasImageBeenOptimized = true;
  for (const outputPath of outputPaths) {
    if (!fs.existsSync(path.resolve(__dirname, outputPath))) {
      hasImageBeenOptimized = false;
    }
  }

  // Process the image if doesn't exist
  if (!hasImageBeenOptimized) {
    await Image(data.src, options)
  }

  let imageAttributes = {
    alt: data.alt,
    sizes: data.sizes,
    loading: "lazy",
    decoding: "async",
  };

  let html = Image.generateHTML(stats, imageAttributes);

  var md = new markdownIt({ typographer: true });
  let captionHtml = data.caption ? `<figcaption>${md.renderInline(data.caption)}</figcaption>` : ''
  let figureClass = data.class ? `class="${data.class}"` : ''
  return `<figure ${figureClass}>${html}${captionHtml}</figure>`
}

function blockShortcode(content, title) {
  var md = new markdownIt({ typographer: true });
  return `<div class="block-note"><span class="block-title">${md.renderInline(title)}</span>${md.render(content)}</div>`
}

module.exports = function (config) {
  // CSS Components
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

  config.on("beforeWatch", () => {
    cssManager.resetComponentCode();
  });

  // Filters
  Object.keys(filters).forEach((filterName) => {
    config.addFilter(filterName, filters[filterName])
  })

  // Collections
  config.addCollection("latestWiki", function (collection) {
    return collection.getFilteredByTag("wiki")
    .filter(function(item) {
      return item.url !== false
    })
    .sort(function (a, b) {
      return b.data.lastModified - a.data.lastModified;
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

  config.addCollection("catalogueTypes", collection => {
    const typesSet = new Set();
    collection.getFilteredByTag("catalogue").forEach(item => {
      if (!item.data.type) return;
      typesSet.add(item.data.type.replace("catalogue", "").toLowerCase())
    })
    return Array.from(typesSet).sort()
  });

  config.setLibrary(
    'md',
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
      .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.headerLink(),
        assistiveText: title => `Permalink to “${title}”`,
        level: [1, 2, 3, 4]
      })
  )

  // Plugins
  config.addPlugin(pluginTOC)
  config.addPlugin(pluginFootnotes, {baseClass: 'footnotes'})
  config.addPlugin(pluginNavigation);
  config.addPlugin(pluginSyntaxHighlight);
  config.addPlugin(pluginTypography);
  config.addPlugin(pluginESbuild, {
    entryPoints: {
      main: "theme/js/index.js",
      catalogue: "theme/js/catalogue.js"
    },
    output: "_site/"
  });

  config.addWatchTarget("./theme/**/*.css");
  config.addWatchTarget('./tailwind.config.js')
  config.addWatchTarget("./theme/**/*.js");
  config.addWatchTarget("**/*.md");

  config.addPassthroughCopy({"theme/fonts": "fonts/"});
  //config.addPassthroughCopy({"theme/js/catalogue.js": "catalogue.js"})
  config.addPassthroughCopy({"theme/assets/favicon.svg": "favicon.svg"})

  config.setDataDeepMerge(true);

  config.addNunjucksAsyncShortcode("image", imageShortcode);
  config.addNunjucksAsyncShortcode("cover", indexCoverShortcode);
  config.addNunjucksAsyncShortcode("catalogueCover", catalogueCoverShortcode);

  config.addPairedNunjucksShortcode("note", blockShortcode);

  // TODO: Implement Youtube shortcode
  config.addShortcode('youtube', function(id) {return `${id}`})

  config.addPairedShortcode("esbuild", pluginESbuild.esBuildShortcode)

  // Minify HTML
  config.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html') && process.env.ELEVENTY_PRODUCTION) {
      let minified = minifyHTML(content)
      return minified
    }
    return content;
  })

  config.addTransform("jsonmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".json")) {
      return JSON.stringify(JSON.parse(content))
    }

    return content;
  })

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ['njk', 'md']
  }
};

async function processCSS(content) {
  return csso.minify(content, {
    comments: false
  }).css;
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
