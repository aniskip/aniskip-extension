import MalsyncHttpClient from '../api/malsync_http_client';
import Page from '../types/pages/page_type';

abstract class BasePage implements Page {
  hostname: string;

  pathname: string;

  document: Document;

  malId: number;

  constructor(hostname: string, pathname: string, document: Document) {
    this.hostname = hostname;
    this.pathname = pathname;
    this.document = document;
    this.malId = 0;
  }

  abstract getIdentifier(): string;

  abstract getEpisodeNumber(): Promise<number>;

  getProviderName(): string {
    return this.constructor.name.toString();
  }

  async getMalId(): Promise<number> {
    if (this.malId !== 0) {
      return this.malId;
    }

    const malsyncHttpClient = new MalsyncHttpClient();
    const providerName = this.getProviderName();
    const identifier = this.getIdentifier();
    this.malId = await malsyncHttpClient.getMalId(providerName, identifier);

    return this.malId;
  }
}

export default BasePage;
