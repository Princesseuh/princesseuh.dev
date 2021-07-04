module.exports = {
  title: 'Princesseuh',
  url: process.env.ELEVENTY_PRODUCTION ? 'https://sad-volhard-0bbcdf.netlify.app' : 'http://localhost:8080',
  build_time: new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(new Date()),
};
