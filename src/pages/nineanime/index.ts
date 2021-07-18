import BasePage from '../base_page';

class Nineanime extends BasePage {
  getIdentifier(): string {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return cleansedPath.split(/\/ep-/)[0];
  }

  getRawEpisodeNumber(): number {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    const episodeString = cleansedPath.split(/\/ep-/)[1];

    if (episodeString === 'full') {
      return 1;
    }

    const episodeNumber = parseInt(episodeString, 10);

    return episodeNumber;
  }
}

export default Nineanime;
