import Page from '../types/pages/page_type';

abstract class BasePage implements Page {
  hostname: string;

  pathname: string;

  document: Document;

  constructor(hostname: string, pathname: string, document: Document) {
    this.hostname = hostname;
    this.pathname = pathname;
    this.document = document;
  }

  abstract getProviderName(): string;

  abstract getIdentifier(): string;

  abstract getEpisodeNumber(): number;
}

export default BasePage;
