import BasePage from '../base_page';

class Nineanime extends BasePage {
  getIdentifier() {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return cleansedPath.split(/\/ep-/)[0];
  }

  getRawEpisodeNumber() {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    const episodeNumber = parseInt(cleansedPath.split(/\/ep-/)[1], 10);

    return episodeNumber;
  }
}

export default Nineanime;
