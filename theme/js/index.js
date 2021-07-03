import { listen } from 'quicklink';
import initSPA from './spa.mjs';

const rtf = new Intl.RelativeTimeFormat('en');

function makeDatesRelative() {
  const dateElements = document.querySelectorAll('[data-date]');

  dateElements.forEach((element) => {
    if (element.dataset.date === 'Invalid Date') {
      return;
    }

    const date = new Date(element.dataset.date);
    const deltaDays = Math.round((date.getTime() - Date.now()) / (1000 * 3600 * 24));

    if (deltaDays === 0) {
      const deltaHours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));

      if (deltaHours === 0) {
        element.textContent = 'less than an hour ago';
      } else {
        element.textContent = rtf.format(deltaHours, 'hours');
      }
    } else {
      element.textContent = rtf.format(deltaDays, 'days');
    }

    element.title = date;
  });
}

function onPageLoad() {
  makeDatesRelative();

  if (!(localStorage.getItem('prefetchDisabled') === 'true')) {
    listen({
      hrefFn: (element) => {
        if (!(localStorage.getItem('spaDisabled') === 'true')) {
          return element.href + (element.href.endsWith('/') ? 'content.json' : '/content.json');
        }
        return element.href;
      },
    });
  }
}

if (!(localStorage.getItem('spaDisabled') === 'true')) {
  initSPA(onPageLoad);
}

onPageLoad();
