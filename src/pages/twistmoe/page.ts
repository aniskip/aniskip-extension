import BasePage from '../base_page';

class Twistmoe extends BasePage {
  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getEpisodeNumber(): number {
    return parseInt(this.pathname.split('/')[3], 10);
  }
}

export default Twistmoe;
