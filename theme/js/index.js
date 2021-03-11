import 'instant.page';
import { initSPA } from './spa.mjs';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

initSPA(makeDatesRelative);

function makeDatesRelative() {
  const dateElements = document.querySelectorAll(`[data-date]`);

  dateElements.forEach((element) => {
    element.textContent = dayjs().to(dayjs(element.dataset.date));
    element.title = dayjs(element.dataset.date);
  })
}

makeDatesRelative();
