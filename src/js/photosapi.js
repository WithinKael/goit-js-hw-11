import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '39406801-8190735af29119bb92d60f7da';

  constructor() {
    this.searchQuery = null;
    this.page = 1;
  }

  getImages() {
    const params = new URLSearchParams({
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    });

    return axios.get(
      `${PixabayAPI.BASE_URL}?key=${PixabayAPI.API_KEY}&${params}`
    );
  }
}
