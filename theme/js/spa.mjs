export function initSPA(callDuringLoad) {
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

  window.addEventListener('popstate', (e) => {
    loadPage(location.href, (e.state && e.state.scrollPosition) || 0)
  });

  window.addEventListener('hashchange', (e) => {
    e.preventDefault()
  });

  function loadPage(href, scrollPosition = 0) {
    const transitionEnabled = !(localStorage.getItem("transitionsDisabled") === "true")
    const targetLoc = new URL(href, document.baseURI);

    // Originally, I wanted to use a .json file for every page instead of using the raw HTML of the result page, much like
    // smarter frameworks do with .js files. However, this turned out to be harder to do than expected and even though it worked
    // I couldn't figure out a clean way of doing it. So, unfortunately we're downloading more data than needed to render our
    // new pages, that's okay - this is not a big website, at worst requests will be 1-2 kb(s) bigger than they could be - erika, 2021-01-25
    // const targetFile = targetLoc.pathname.replace(/\/$/, "").split("/").pop();
    // const ApiUrl = new URL("/api/" + targetFile + ".json", document.baseURI);

    const container = document.querySelector('main');

    if (transitionEnabled) {
      const articleContainer = document.querySelector('article')
      articleContainer.style.opacity = 0;

      // If we wanted to transitions the asides as well, we could simply do this - however, it causes transitions between wiki pages which is undesirable
      // asideContainer?.forEach(aside => {
      //   aside.style.opacity = 0;
      // })

    }

    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      document.body.style.cursor = 'default';

      const responseDocument = xhr.responseXML;
      const responseContent = responseDocument.querySelector('main');
      const responseStyle = responseDocument.getElementsByTagName('style')[0];
      const responseScripts = responseContent.querySelectorAll('script');

      if (transitionEnabled) {
        const asideContainer = document.querySelectorAll('aside');
        const responseArticleContainer = responseDocument.querySelector('article');
        const responseAsides = responseDocument.querySelectorAll('aside');
        const responseToc = responseDocument.querySelector('.toc');

        responseArticleContainer.style.opacity = 0;

        if (responseToc)
          responseToc.style.opacity = 0;

        if (asideContainer.length === 0) {
          responseAsides.forEach(aside => {
            aside.style.opacity = 0;
          })
        }
      }

      // This is a bit of a naive approach, It'd probably be better to hide with our animation, wait for the DOM to be
      // completely updated and then reappear instead of just assuming it will be instant for everybody - erika, 2021-01-25
      setTimeout(() => {
        document.title = responseDocument.title;

        const currentStyle = document.getElementsByTagName('style')[0];
        currentStyle.innerHTML = responseStyle.innerHTML;

        container.innerHTML = (responseContent && responseContent.innerHTML) || '';

        // Script tags are not executed when changing a page content through innerHTMl so we eval them
        // this is probably not the best solution but we won't ever have that much script tags on our pages
        if (responseScripts) {
          responseScripts?.forEach(script => {
            if (script.src) {
                var scriptElement = document.createElement('script')
                scriptElement.src = script.src
                container.appendChild(scriptElement)
              } else {
                (new Function(script.text))()
              }
            }
          )

        }

        // Our function can be supplied a function to execute when loading a page
        if (callDuringLoad)
          callDuringLoad()

        if (transitionEnabled) {
          const toc = container.querySelector(".toc");
          const asides = container.querySelectorAll("aside");
          const article = container.querySelector("article");

          article.offsetHeight;
          article.style.opacity = 1;

          if (toc) {
            toc.style.opacity = 1;
          }

          asides?.forEach(aside => {
            aside.style.opacity = 1;
          })
        }

        if (targetLoc.hash && !scrollPosition) {
          const target = document.querySelector(decodeURIComponent(link.hash));
          target?.scrollIntoView(true);
        }

        window.scrollTo(0, scrollPosition);
      }, transitionEnabled ? 100 : 0);
    }

    xhr.open('GET', targetLoc);
    xhr.responseType = 'document';
    xhr.send();
    document.body.style.cursor = 'wait';
  }
}
