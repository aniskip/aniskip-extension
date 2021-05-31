import BasePage from '../base_page';

class FourAnime extends BasePage {
  getTitle() {
    const title = this.document.getElementById('titleleft')?.innerText;

    return title || '';
  }

  getIdentifier() {
    return this.pathname.replace('/', '').split('-episode')[0];
  }

  getRawEpisodeNumber() {
    const episodeString = this.pathname.split('episode-')[1];
    if (episodeString) {
      const episodeNumber = parseInt(episodeString, 10);
      return episodeNumber;
    }

    return 1;
  }
}

export default FourAnime;
