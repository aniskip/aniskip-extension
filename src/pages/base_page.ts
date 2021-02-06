import Page from '../types/pages/page_type';
import capitalizeFirstLetter from '../utils/string_utils';

abstract class BasePage implements Page {
  hostname: string;

  pathname: string;

  document: Document;

  constructor(hostname: string, pathname: string, document: Document) {
    this.hostname = hostname;
    this.pathname = pathname;
    this.document = document;
  }

  getProviderName(): string {
    const domain = this.hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');
    return capitalizeFirstLetter(domain);
  }

  abstract getIdentifier(): string;

  abstract getEpisodeNumber(): number;
}

export default BasePage;
