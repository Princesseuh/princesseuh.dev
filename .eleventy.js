/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const shortHash = require('shorthash2');

const HTMLMinifier = require('html-minifier-terser').minify;
const csso = require('csso');

const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const AssetManager = require('@11ty/eleventy-assets');
const Image = require('@11ty/eleventy-img');

const pluginNavigation = require('@11ty/eleventy-navigation');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginTypography = require('@jamshop/eleventy-plugin-typography');
const pluginTOC = require('eleventy-plugin-nesting-toc');
const pluginFootnotes = require('eleventy-plugin-footnotes');
const pluginESbuild = require('@jamshop/eleventy-plugin-esbuild');
const pluginSocialImages = require('@manustays/eleventy-plugin-generate-social-images');

const cheerio = require('cheerio');
const { SiteChecker } = require('broken-link-checker');
const filters = require('./config/filters.js');

function getCssFilePath(componentName) {
  return `theme/css/${componentName}.css`;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// from https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
function ensurePathExists(path, mask, cb) {
  if (typeof mask === 'function') { // Allow the `mask` parameter to be optional
    cb = mask;
    mask = '0777';
  }
  fs.mkdir(path, { mask, recursive: true }, (err) => {
    if (err) {
      if (err.code == 'EEXIST') cb(null); // Ignore the error if the folder already exists
      else cb(err); // Something else went wrong
    } else cb(null); // Successfully created folder
  });
}

function checkIfOptimizedImageExists(src, options) {
  const stats = Image.statsSync(src, options);

  /** Creating a flat array of all the output paths from the stats object. */
  const outputPaths = Object.keys(stats).reduce((acc, key) => [
    ...acc,
    ...stats[key].map((resource) => resource.outputPath),
  ], []);

  /** Checking if all output files exists. */
  let hasImageBeenOptimized = true;
  for (const outputPath of outputPaths) {
    if (!fs.existsSync(path.resolve(__dirname, outputPath))) {
      hasImageBeenOptimized = false;
    }
  }

  return {optimized: hasImageBeenOptimized, stats: stats};
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
    ...imageOptions,
  };

  const imageResult = checkIfOptimizedImageExists(src, options)
  let stats = imageResult.stats
  if (!imageResult.optimized) {
    stats = await Image(src, options);
  }

  return `<picture>
    ${Object.values(stats).map((imageFormat) => `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map((entry) => entry.srcset).join(', ')}" sizes="${sizes}">`).join('\n')}
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
    ...imageOptions,
  };

  const imageResult = checkIfOptimizedImageExists(data.src, options)
  let stats = imageResult.stats
  if (!imageResult.optimized) {
    stats = await Image(data.src, options);
  }

  const pictureClass = data.class ? `class="${data.class}"` : '';
  const result = `<picture ${pictureClass}>
    ${Object.values(stats).map((imageFormat) => `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map((entry) => entry.srcset).join(', ')}">`).join('\n')}
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
    return minifyHTML(escapeHtml(result).replace(/(\r\n|\n|\r)/gm, ''));
  }
  return result;
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
    ...imageOptions,
  };

  const imageResult = checkIfOptimizedImageExists(data.src, options)
  let stats = imageResult.stats
  if (!imageResult.optimized) {
    stats = await Image(data.src, options);
  }

  const imageAttributes = {
    alt: data.alt,
    sizes: data.sizes,
    loading: 'lazy',
    decoding: 'async',
  };

  const html = Image.generateHTML(stats, imageAttributes);

  const md = new markdownIt({ typographer: true });
  const captionHtml = data.caption ? `<figcaption>${md.renderInline(data.caption)}</figcaption>` : '';
  const figureClass = data.class ? `class="${data.class}"` : '';
  return `<figure ${figureClass}>${html}${captionHtml}</figure>`;
}

function blockShortcode(content, title) {
  const md = new markdownIt({ typographer: true });
  return `<div class="block-note"><span class="block-title">${md.renderInline(title)}</span>${md.render(content)}</div>`;
}

module.exports = function (config) {
  // CSS Components
  const cssManager = new AssetManager.InlineCodeManager();

  config.addNunjucksAsyncShortcode('usingCSSComponent', async function (componentName) {
    if (!cssManager.hasComponentCode(componentName)) {
      const cssPath = getCssFilePath(componentName);

      const componentCss = fs.readFileSync(cssPath, { encoding: 'UTF-8' });

      const result = await processCSS(componentCss, cssPath);
      cssManager.addComponentCode(componentName, result);
    }

    cssManager.addComponentForUrl(componentName, this.page.url);

    return '';
  });

  config.addFilter('getCss', (url) => cssManager.getCodeForUrl(url));

  config.on('beforeWatch', () => {
    cssManager.resetComponentCode();
  });

  // Filters
  Object.keys(filters).forEach((filterName) => {
    config.addFilter(filterName, filters[filterName]);
  });

  // Collections
  config.addCollection('latestWiki', (collection) => collection.getFilteredByTag('wiki')
    .filter((item) => item.url !== false)
    .sort((a, b) => b.data.lastModified - a.data.lastModified));

  config.addCollection('tagListPosts', (collection) => {
    const tagsSet = new Set();
    collection.getFilteredByTag('post').forEach((item) => {
      if (!item.data.tags) return;
      item.data.tags
        .filter((tag) => !['post', 'all'].includes(tag))
        .forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  });

  config.addCollection('catalogueTypes', (collection) => {
    const typesSet = new Set();
    collection.getFilteredByTag('catalogue').forEach((item) => {
      if (!item.data.type) return;
      typesSet.add(item.data.type.replace('catalogue', '').toLowerCase());
    });
    return Array.from(typesSet).sort();
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
        assistiveText: (title) => `Permalink to “${title}”`,
        level: [1, 2, 3, 4],
      }),
  );

  // Plugins
  config.addPlugin(pluginTOC);
  config.addPlugin(pluginFootnotes, { baseClass: 'footnotes' });
  config.addPlugin(pluginNavigation);
  config.addPlugin(pluginSyntaxHighlight);
  config.addPlugin(pluginTypography);
  config.addPlugin(pluginESbuild, {
    entryPoints: {
      main: 'theme/js/index.js',
      catalogue: 'theme/js/catalogue.js',
    },
    output: '_site/',
  });
  config.addPlugin(pluginSocialImages, {
    promoImage: './theme/assets/social.png',
    outputDir: './_site/img/socials',
    urlPath: 'img/socials',
    siteName: 'princesseuh.dev',
    titleColor: '#FEFFFE',
    bgColor: '#28262C',
    hideTerminal: true,
    lineBreakAt: 45,
  });

  config.addWatchTarget('./theme/**/*.css');
  config.addWatchTarget('./tailwind.config.js');
  config.addWatchTarget('./theme/**/*.js');
  config.addWatchTarget('**/*.md');

  config.addPassthroughCopy({ 'theme/fonts': 'fonts/' });
  // config.addPassthroughCopy({"theme/js/catalogue.js": "catalogue.js"})
  config.addPassthroughCopy({ 'theme/assets/favicon.svg': 'favicon.svg' });
  config.addPassthroughCopy({ 'theme/assets/social-card.png': 'social-card.png' });

  config.setDataDeepMerge(true);

  config.addNunjucksAsyncShortcode('image', imageShortcode);
  config.addNunjucksAsyncShortcode('cover', indexCoverShortcode);
  config.addNunjucksAsyncShortcode('catalogueCover', catalogueCoverShortcode);

  config.addPairedNunjucksShortcode('note', blockShortcode);

  // TODO: Implement Youtube shortcode
  config.addShortcode('youtube', (id) => `${id}`);

  config.addPairedShortcode('esbuild', pluginESbuild.esBuildShortcode);

  // Minify HTML
  config.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html') && process.env.ELEVENTY_PRODUCTION) {
      const minified = minifyHTML(content);
      return minified;
    }
    return content;
  });

  config.addTransform('html2jsonapi', (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      const htmlContent = cheerio.load(content);
      const styleElement = htmlContent('head > style');

      const JsonContent = {
        title: htmlContent('title').text().trim(),
        content: htmlContent('main').html(),
      };

      if (styleElement.html().trim() != '') {
        JsonContent.style = styleElement.html();
      }

      const data = JSON.stringify(JsonContent);

      ensurePathExists(outputPath.replace('/index.html', ''), (err) => {
        if (err) console.error(`Couldn't create API folder ${err}`);
        else {
          fs.writeFileSync(outputPath.replace('index.html', 'content.json'), data);
        }
      });
    }
    return content;
  });

  config.addTransform('jsonmin', (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.json')) {
      return JSON.stringify(JSON.parse(content));
    }

    return content;
  });

  if (!process.env.ELEVENTY_PRODUCTION) {
    config.on('beforeWatch', () => {
      const checker = new SiteChecker({ excludeExternalLinks: true }, {
        link: ({ broken, base, url }) => {
          if (!broken) return;

          console.warn(`Broken link found: ${url.original} in ${base.original}`);
        },
      });

      checker.enqueue('http://localhost:8080/');
    });
  }

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md'],
  };
};

async function processCSS(content) {
  return csso.minify(content, {
    comments: false,
  }).css;
}

function minifyHTML(content) {
  const minified = HTMLMinifier(content, {
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
    removeOptionalTags: true,
    removeAttributeQuotes: true,
    collapseBooleanAttributes: true,
  });

  return minified;
}
