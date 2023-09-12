import { galleryItems } from './gallery-items.js';
// Change code below this line

// ===================================== RENDER PHOTOS ==============================================
const listEl = document.querySelector('.gallery');

function photosMarkup(array) {
    const markup = array.map((element) => {
        return `
<li class="gallery__item">
  <a class="gallery__link" href="large-image.jpg">
    <img
      class="gallery__image"
      src="${element.preview}"
      data-source="${element.original}"
      alt="${element.description}"
      loading="lazy"
    />
  </a>
</li>`
    }).join('\n');
    return markup;
};

function renderPhotos(array) {
    const markup = photosMarkup(array);
    listEl.innerHTML = markup;
};

renderPhotos(galleryItems);

// ===================================== CLICK IMG ==============================================

let instance;
const onListElClick = event => {
    event.preventDefault();
    if (event.target.nodeName !== "IMG") {
        return;
    } else {
      instance = basicLightbox.create(`<img src="${event.target.dataset.source}">`, {
        onClose: () => {
        document.removeEventListener('keydown', onSpaceClick);
      }});
      instance.show();
    }
  document.addEventListener('keydown', onSpaceClick);
};

listEl.addEventListener('click', onListElClick);

// ===================================== CLICK SPACE ==============================================

const onSpaceClick = event => {
  console.log(event.key);
  if (event.code === 'Escape') {
    instance.close();
  } 
};

