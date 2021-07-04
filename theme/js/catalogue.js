import { QuickScore } from 'quick-score';

let fullElements;
const catalogue = document.getElementById('catalogue');
let catalogueContainer = document.getElementById('catalogueContent');
const resultCount = document.getElementById('catalogueCount');

function buildLibrary(elements, page = 1) {
  const catalogueClasses = catalogueContainer.className;
  catalogueContainer.remove();
  catalogueContainer = document.createElement('div');
  catalogueContainer.className = catalogueClasses;

  catalogue.appendChild(catalogueContainer);

  resultCount.innerText = `${elements.length} element${elements.length > 1 ? 's' : ''}`;

  Object.values(elements).forEach((element) => {
    const itemContainer = document.createElement('div');
    itemContainer.className = 'max-w-[200px]';
    const cover = new DOMParser().parseFromString(element.cover, 'text/html').documentElement.textContent;
    const content = `
    <a href="${element.path}" class="hover:no-underline">
    ${cover}
    <span class="block">${element.title}</span>
    <span class="text-sm text-creative-work">${element.author}</span>
    </a>
    `;

    itemContainer.innerHTML = content;

    catalogueContainer.appendChild(itemContainer);
  });
}

function updateFilters() {
  let result = fullElements;
  const searchFilter = document.getElementById('catalogueSearch');
  const typeFilter = document.getElementById('catalogueType');
  const searchParams = new URLSearchParams(window.location.search);

  if (typeFilter.value !== 'all') {
    result = result.filter((element) => element.type === typeFilter.value);
    searchParams.set('type', typeFilter.value);
  } else {
    searchParams.delete('type');
  }

  if (searchFilter.value !== '') {
    const qs = new QuickScore(result, ['title', 'author']);
    const search = qs.search(searchFilter.value);

    // Adding search to the URl works perfectly however, it result in a very unpleasant experience
    // when going back through the browser. Perhaps setting it at some other time would be possible however
    // searchParams.set('search', searchFilter.value);

    // QuickStore return an array in its custom format so we need to rebuild it in ours
    result = [];
    search.forEach((hit) => {
      result.push(hit.item);
    });
  }

  buildLibrary(result);

  const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.replaceState(null, '', newRelativePathQuery);
}

function initCatalogue() {
  const filters = document.querySelectorAll('.catalogueFilter');
  const searchParams = new URLSearchParams(window.location.search);
  filters.forEach((filterElement) => {
    filterElement.addEventListener(filterElement.type === 'text' ? 'input' : 'change', updateFilters);

    if (searchParams.get(filterElement.name)) {
      filterElement.value = searchParams.get(filterElement.name);
    }
  });

  fetch('/api/catalogueContent.json')
    .then((response) => response.json())
    .then((data) => {
      fullElements = data.content;

      if (searchParams.toString() !== '') {
        updateFilters();
      } else {
        buildLibrary(fullElements);
      }
    });
}

initCatalogue();
