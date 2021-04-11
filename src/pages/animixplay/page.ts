import BasePage from '../base_page';

class AniMixPlay extends BasePage {
  getTitle(): string {
    const titleSpan = this.document.getElementsByClassName('animetitle')[0];
    if (titleSpan) {
      return titleSpan.innerHTML;
    }
    return this.getIdentifier();
  }

  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getEpisodeNumber(): Promise<number> {
    const episodeString = this.pathname.split('ep')[1];
    if (episodeString) {
      const episodeNumber = parseInt(episodeString, 10);
      return Promise.resolve(episodeNumber);
    }
    return Promise.resolve(1);
  }
}

export default AniMixPlay;
