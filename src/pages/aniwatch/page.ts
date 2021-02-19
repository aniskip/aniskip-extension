import BasePage from '../base_page';

class Aniwatch extends BasePage {
  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getEpisodeNumber(): Promise<number> {
    const episodeNumber = parseInt(this.pathname.split('/')[3], 10);
    return Promise.resolve(episodeNumber);
  }
}

export default Aniwatch;
