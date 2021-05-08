import { listen } from 'quicklink';
import { initSPA } from './spa.mjs';

initSPA(onPageLoad);

const rtf = new Intl.RelativeTimeFormat("en");

function makeDatesRelative() {
  const dateElements = document.querySelectorAll(`[data-date]`);

  dateElements.forEach((element) => {
    const date = new Date(element.dataset.date)
    const deltaDays = (date.getTime() - Date.now()) / (1000 * 3600 * 24);

    element.textContent = rtf.format(Math.round(deltaDays), 'days')

    element.title = date
  })
}

function onPageLoad() {
  makeDatesRelative();

  if (!(localStorage.getItem("prefetchDisabled") === "true")) {
    listen();
  }
}

onPageLoad();
