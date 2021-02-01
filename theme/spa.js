(function () {
  'use strict';

  // This part is (a bit) inspired by the router Vitepress ship with at the time of writing, albeit a bit simpler and less featured
  window.addEventListener('click', (evt) => {
    const link = (evt.target).closest('a');
    if (link) {
      const { href, hostname, pathname, hash, target } = link
      const currentURL = window.location;

      if (
        !evt.ctrlKey &&
        !evt.altKey &&
        !evt.shiftKey &&
        !evt.metaKey &&
        target !== '_blank' &&
        hostname === currentURL.hostname
      ) {
        evt.preventDefault();

        if (pathname === currentURL.pathname) {
          // If we're on the same page and the link is only an anchor, we scroll to it like the browser would
          if (hash && hash !== currentURL.hash) {
            history.pushState(null, '', hash);

            const target = document.querySelector(decodeURIComponent(link.hash));
            target?.scrollIntoView(true);
          }
        } else {
          // Save the current scroll position before changing to a new page
          history.replaceState({ scrollPosition: window.scrollY }, document.title);
          history.pushState(null, '', href);

          loadPage(href);
        }
      }

    }
  })

  function loadPage(href, scrollPosition = 0) {
    const targetLoc = new URL(href, document.baseURI);
    const targetFile = targetLoc.pathname.replace(/\/$/, "").split("/").pop();

    // Originally, I wanted to use a .json file for every page instead of using the raw HTML of the result page, much like
    // smarter frameworks do with .js files. However, this turned out to be harder to do than expected and even though it worked
    // I couldn't figure out a clean way of doing it. So, unfortunately we're downloading more data than needed to render our
    // new pages, that's okay - this is not a big website, at worst requests will be 1-2 kb(s) bigger than they could be - erika, 2021-01-25
    const ApiUrl = new URL("/api/" + targetFile + ".json", document.baseURI);

    const container = document.querySelector('main');
    const articleContainer = document.querySelector('article')
    const asideContainer = document.querySelectorAll('aside')
    articleContainer.style.opacity = 0;

    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      document.body.style.cursor = 'default';

      const responseDocument = xhr.responseXML;
      const responseContent = responseDocument.querySelector('main');
      const responseArticleContainer = responseDocument.querySelector('article');
      const responseAsides = responseDocument.querySelectorAll('aside');
      const responseToc = responseDocument.querySelector('.toc');
      const responseStyle = responseDocument.getElementsByTagName('style')[0];

      responseArticleContainer.style.opacity = 0;

      if (responseToc)
        responseToc.style.opacity = 0;

      if (asideContainer.length === 0) {
        responseAsides.forEach(aside => {
          aside.style.opacity = 0;
        })
      }

      // This is a bit of a naive approach, It'd probably be better to hide with our animation, wait for the DOM to be
      // completely updated and then reappear instead of just assuming it will be instant for everybody - erika, 2021-01-25
      setTimeout(() => {
        document.title = responseDocument.title;

        const currentStyle = document.getElementsByTagName('style')[0];
        currentStyle.innerHTML = responseStyle.innerHTML;

        container.innerHTML = (responseContent && responseContent.innerHTML) || '';

        // Wait for a bit before setting back the opacity otherwise it won't work
        setTimeout(() => {
          container.querySelector("article").style.opacity = 1;

          const toc = container.querySelector(".toc");
          if (toc)
            toc.style.opacity = 1;

          container.querySelectorAll("aside")?.forEach(aside => {
            aside.style.opacity = 1;
          })
        }, 15);

        if (targetLoc.hash && !scrollPosition) {
          const target = document.querySelector(decodeURIComponent(link.hash));
          target?.scrollIntoView(true);
        }

        window.scrollTo(0, scrollPosition);
      }, 100);
    }

    xhr.open('GET', targetLoc);
    xhr.responseType = 'document';
    xhr.send();
    document.body.style.cursor = 'wait';
  }

  window.addEventListener('popstate', (e) => {
    loadPage(location.href, (e.state && e.state.scrollPosition) || 0)
  });

  window.addEventListener('hashchange', (e) => {
    e.preventDefault()
  });
})();
