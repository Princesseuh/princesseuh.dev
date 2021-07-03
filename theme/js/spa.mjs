export default function initSPA(callDuringLoad) {
  function loadPage(href, scrollPosition = 0) {
    document.body.style.cursor = 'wait';

    const transitionEnabled = !(localStorage.getItem('transitionsDisabled') === 'true');
    const targetLoc = new URL(href, document.baseURI);
    const targetLocJSON = new URL(window.location.href + (window.location.href.endsWith('/') ? 'content.json' : '/content.json'));

    const styleContainer = document.getElementsByTagName('style')[0];
    const asideContainer = document.getElementsByTagName('aside');
    let container = document.querySelector('main');

    if (transitionEnabled) {
      const articleContainer = document.querySelector('article');
      if (articleContainer) articleContainer.style.opacity = 0;

      const tocContainer = document.querySelector('.toc');
      if (tocContainer) tocContainer.style.opacity = 0;

      // If we wanted to transitions the asides as well, we could simply do this - however, it causes transitions between wiki pages which is undesirable
      // asideContainer?.forEach(aside => {
      //   aside.style.opacity = 0;
      // })
    }

    fetch(targetLocJSON)
      .then((response) => response.json())
      .then((data) => {
        const template = document.createElement('template');
        template.innerHTML = `<main>${data.content}</main>`;
        const templateScripts = template.content.querySelectorAll('script');

        if (transitionEnabled) {
          const resultArticleContainer = template.content.querySelector('article');
          const resultToc = template.content.querySelector('.toc');
          const resultAsides = template.content.querySelectorAll('aside');

          resultArticleContainer.style.opacity = 0;

          if (resultToc) resultToc.style.opacity = 0;

          if (asideContainer.length === 0) {
            resultAsides?.forEach((aside) => {
              aside.style.opacity = 0;
            });
          }
        }

        setTimeout(() => {
          document.body.style.cursor = 'default'; // Reset default cursor
          document.title = data.title;

          styleContainer.innerHTML = data.style || '';

          container.replaceWith(template.content.cloneNode(true));
          container = document.querySelector('main');

          // Script tags are not executed when changing a page content through replaceWith so we eval them
          // for inline ones and create a new script element for those from external files
          if (templateScripts) {
            templateScripts?.forEach((script) => {
              if (script.src) {
                const scriptElement = document.createElement('script');
                scriptElement.src = script.src;
                container.appendChild(scriptElement);
              } else {
                // eslint-disable-next-line no-new-func
                (new Function(script.text))();
              }
            });
          }

          // If we supplied a function to call once the page is loaded, execute it
          if (callDuringLoad) callDuringLoad();

          if (transitionEnabled) {
            const article = container.querySelector('article');
            const toc = container.querySelector('.toc');
            const asides = container.querySelectorAll('aside');

            // eslint-disable-next-line no-unused-expressions
            article.offsetHeight;
            article.style.opacity = 1;

            if (toc) {
              toc.style.opacity = 1;
            }

            asides?.forEach((aside) => {
              aside.style.opacity = 1;
            });
          }

          if (targetLoc.hash && !scrollPosition) {
            const target = document.querySelector(decodeURIComponent(targetLoc.hash));
            target?.scrollIntoView(true);
          }

          window.scrollTo(0, scrollPosition);
        }, transitionEnabled ? 100 : 0);
      })
      .catch((err) => {
        window.location.assign(targetLoc.href);
      });
  }

  // This part is (a bit) inspired by the router Vitepress ship with at the time of writing, albeit a bit simpler and less featured
  window.addEventListener('click', (evt) => {
    const link = (evt.target).closest('a');
    if (link) {
      const {
        href, hostname, pathname, hash, target,
      } = link;
      const currentURL = window.location;

      if (
        !evt.ctrlKey
        && !evt.altKey
        && !evt.shiftKey
        && !evt.metaKey
        && target !== '_blank'
        && hostname === currentURL.hostname
      ) {
        evt.preventDefault();

        if (pathname === currentURL.pathname) {
          // If we're on the same page and the link is only an anchor, we scroll to it like the browser would
          if (hash && hash !== currentURL.hash) {
            history.pushState(null, '', hash);

            const targetElement = document.querySelector(decodeURIComponent(link.hash));
            targetElement?.scrollIntoView(true);
          }
        } else {
          // Save the current scroll position before changing to a new page
          history.replaceState({ scrollPosition: window.scrollY }, document.title);
          history.pushState(null, '', href);

          loadPage(href);
        }
      }
    }
  });

  window.addEventListener('popstate', (e) => {
    loadPage(location.href, (e.state && e.state.scrollPosition) || 0);
  });

  window.addEventListener('hashchange', (e) => {
    e.preventDefault();
  });
}
