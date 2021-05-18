import BasePage from '../base_page';

class Crunchyroll extends BasePage {
  getIdentifier() {
    const title = this.getTitle();
    const encoded = encodeURIComponent(title.toLocaleLowerCase());
    const reEncoded = encodeURIComponent(encoded.replace(/\./g, '%2e'));
    return reEncoded;
  }

  getRawEpisodeNumber() {
    const matches = this.pathname.match(/episode-([0-9]+)/);
    if (matches) {
      const episodeNumber = parseInt(matches[1], 10);
      return episodeNumber;
    }

    return 0;
  }

  getTitle() {
    const title = this.document
      .querySelector('[name="title"]')
      ?.getAttribute('content')
      ?.split(' Episode')[0];

    return title || '';
  }
}

export default Crunchyroll;
