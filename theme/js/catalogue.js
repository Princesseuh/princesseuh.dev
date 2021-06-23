import { QuickScore } from "quick-score";

var fullElements
var catalogue = document.getElementById("catalogue")
var catalogueContainer = document.getElementById("catalogueContent")
var resultCount = document.getElementById("catalogueCount")

function initCatalogue() {
  let filters = document.querySelectorAll(".catalogueFilter")
  filters.forEach(filterElement => {
    filterElement.addEventListener(filterElement.type == "text" ? "input" : "change", updateFilters)
  })

  fetch("/api/catalogueContent.json")
  .then(response => response.json())
  .then(data => {
    fullElements = data.content
    buildLibrary(fullElements)
  })
}

function buildLibrary(elements, page = 1) {
  let catalogueClasses = catalogueContainer.className
  catalogueContainer.remove()
  catalogueContainer = document.createElement("div")
  catalogueContainer.className = catalogueClasses

  catalogue.appendChild(catalogueContainer)

  resultCount.innerText = `${elements.length} element${elements.length > 1 ? 's' : ""}`

  Object.values(elements).forEach(element => {
    let itemContainer = document.createElement("div")
    itemContainer.className = "max-w-[200px]"
    let cover = new DOMParser().parseFromString(element.cover, "text/html").documentElement.textContent;
    let content = `
    <a href="${element.path}" class="hover:no-underline">
    ${cover}
    <span class="block">${element.title}</span>
    <span class="text-sm text-creative-work">${element.author}</span>
    </a>
    `

    itemContainer.innerHTML = content

    catalogueContainer.appendChild(itemContainer)
  });
}

function updateFilters() {
  let result = fullElements
  const searchFilter = document.getElementById("catalogueSearch")
  const typeFilter = document.getElementById("catalogueType")

  if (typeFilter.value != "all") {
    result = result.filter(element => element.type == typeFilter.value)
  }


  if (searchFilter.value != "") {
    const qs = new QuickScore(result, ["title", "author"])
    const search = qs.search(searchFilter.value)

    // QuickStore return an array in its custom format so we need to rebuild it in ours
    result = []
    search.forEach(hit => {
      result.push(hit.item)
    })
  }

  buildLibrary(result)
}

initCatalogue()
