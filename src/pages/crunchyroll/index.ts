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

    return 1;
  }

  getTitle() {
    const metadata = JSON.parse(
      this.document.querySelector('[type="application/ld+json"]')?.innerHTML ||
        '{}'
    );

    return metadata.partOfSeason.name || '';
  }
}

export default Crunchyroll;
