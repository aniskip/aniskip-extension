import BasePage from '../base_page';

class Nineanime extends BasePage {
  getProviderName(): string {
    const domainName = this.hostname.replace(
      /(?:[^.\n]*\.)?([^.\n]*)(\..*)/,
      '$1'
    );
    return domainName;
  }

  getIdentifier(): string {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return cleansedPath.split(/\/ep-/)[0];
  }

  getEpisodeNumber(): number {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return parseInt(cleansedPath.split(/\/ep-/)[1], 10);
  }
}

export default Nineanime;
