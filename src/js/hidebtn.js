const loadMoreBtnEl = document.querySelector('.load-more');

export function addClass() {
  loadMoreBtnEl.classList.add('is-hidden');
}

export function removeClass() {
  loadMoreBtnEl.classList.remove('is-hidden');
}
