import BasePage from '../base_page';

class Gogoanime extends BasePage {
  getIdentifier() {
    const identifierUnclean = this.pathname.split('-episode-')[0];
    return identifierUnclean.substring(1);
  }

  getRawEpisodeNumber() {
    return parseInt(this.pathname.split('-episode-')[1], 10);
  }
}

export default Gogoanime;
