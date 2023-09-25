import { PixabayAPI } from './photosapi';
import Notiflix from 'notiflix';
import { addClass, removeClass } from './hidebtn';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const gallaryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
let gallery = null;

const pixabayAPI = new PixabayAPI();

async function onFormElSubmit(event) {
  event.preventDefault();
  pixabayAPI.searchQuery = event.target.elements.searchQuery.value.trim();
  pixabayAPI.page = 1;

  if (pixabayAPI.searchQuery === '') {
    return;
  }

  try {
    const response = await pixabayAPI.getImages();
    if (response.data.total === 0) {
      formEl.reset();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallaryEl.innerHTML = '';
      return;
    }

    if (response.data.totalHits < 40) {
      gallaryEl.innerHTML = renderPhotos(response.data.hits);
      addClass();
      return;
    }

    gallaryEl.innerHTML = renderPhotos(response.data.hits);
    Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images`);
    removeClass();

    setTimeout(() => {
      gallery = new SimpleLightbox('.gallery a', {
        docClose: false,
        captionDelay: 250,
      });
    }, 10);
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtn(event) {
  addClass();

  pixabayAPI.page += 1;

  try {
    const response = await pixabayAPI.getImages();
    gallaryEl.insertAdjacentHTML('beforeend', renderPhotos(response.data.hits));
    removeClass();
    gallery.refresh();

    if (Math.ceil(response.data.totalHits / 40) < pixabayAPI.page) {
      addClass();
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .lastElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
  }
}

function renderPhotos(data) {
  const markup = data
    .map(element => {
      return `
      <a href="${element.largeImageURL}">
        <div class="photo-card">
          <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" class="gallery-img"/>
          <div class="info" class="info-wrapper">
            <p class="info-item">
              <b>Likes: ${element.likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${element.views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${element.comments}</b>
            </p>
            <p class="info-item">
               <b>Downloads: ${element.downloads}</b>
            </p>
          </div>
        </div>  
      </a>
    `;
    })
    .join('\n');

  return markup;
}

formEl.addEventListener('submit', onFormElSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtn);