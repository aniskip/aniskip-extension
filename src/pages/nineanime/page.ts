import BasePage from '../base_page';

class Nineanime extends BasePage {
  getIdentifier(): string {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return cleansedPath.split(/\/ep-/)[0];
  }

  getEpisodeNumber(): number {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return parseInt(cleansedPath.split(/\/ep-/)[0], 10);
  }
}

export default Nineanime;
