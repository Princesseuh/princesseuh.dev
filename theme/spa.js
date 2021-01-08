(function () {
  'use strict';
  // Due to popstate not being aware of the previous page, we need to track it ourselves
  var previousURL = undefined;

  function addEventToLinks() {
    var links = Array.from(document.querySelectorAll('a'));
    links.filter(l => l.hostname === location.hostname).forEach(link => {
      link.addEventListener('click', clickHandler)
    })
  }

  var clickHandler = function (event) {
    var linkURL = new URL(this.getAttribute('href'), document.baseURI);
    previousURL = linkURL;

    // If the link is only an anchor to the same page, we fake the anchor behaviour
    if (linkURL.pathname === window.location.pathname && linkURL.hash) {
      event.preventDefault();

      var hashLocation = document.querySelector(linkURL.hash);
      hashLocation?.scrollIntoView(true);
      history.pushState({}, document.title, linkURL);
    }
    else {
      event.preventDefault();
      loadURL(linkURL);
    }
  }

  addEventToLinks();

  window.onpopstate = function (event) {
    loadURL(window.location, true);
  };

  function loadURL(url, popState = false) {
    var container = document.querySelector('main');
    container.classList = "";

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var d = this.responseXML;
      var dTitle = d.title || '';
      var dContainer = d.querySelector('main');
      var dStyle = d.getElementsByTagName('style')[0];

      document.title = dTitle;
      var currentStyle = document.getElementsByTagName('style')[0];
      currentStyle.innerHTML = dStyle.innerHTML;

      container.innerHTML = (dContainer && dContainer.innerHTML) || '';

      var absoluteURL = new URL(url, document.baseURI);
      var samePage = absoluteURL.pathname === window.location.pathname

      if (!samePage || popState) {

        // Unless we're on the same URL, do the transition animation
        if (window.location.pathname !== previousURL.pathname) {
          container.classList = "appear";
        }

        // If we don't have an anchor we scroll back up to simulate page change otherwise, normal anchor behaviour
        if (!absoluteURL.hash) {
          document.documentElement.scrollTop = 0;
        } else {
          var hashLocation = document.querySelector(absoluteURL.hash);
          hashLocation?.scrollIntoView(true);
        }
      }

      // If we're not in a popstate and it's not the same page or not the same anchor, we push to history
      if (!popState && (!samePage || absoluteURL.hash !== window.location.hash)) {
          history.pushState({}, dTitle, url);
      }

      addEventToLinks();
    };

    xhr.open('GET', url);
    xhr.responseType = 'document';
    xhr.send();
  }
})();
