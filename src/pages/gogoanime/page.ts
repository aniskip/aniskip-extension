import BasePage from '../base_page';

class Gogoanime extends BasePage {
  getIdentifier(): string {
    const identifierUnclean = this.pathname.split('-episode-')[0];
    return identifierUnclean.substring(1);
  }

  getEpisodeNumber(): Promise<number> {
    const episodeNumber = parseInt(this.pathname.split('-episode-')[1], 10);
    return Promise.resolve(episodeNumber);
  }
}

export default Gogoanime;
