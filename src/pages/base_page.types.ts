export type Page = {
  hostname: string;

  pathname: string;

  document: Document;

  /**
   * Fetches and applies the episode number redirection rules.
   */
  applyRules(): Promise<void>;

  /**
   * Returns the title.
   */
  getTitle(): string;

  /**
   * Returns the provider name from the url.
   */
  getProviderName(): string;

  /**
   * Returns the series identifier from the url.
   */
  getIdentifier(): string;

  /**
   * Returns the episode number from the url.
   */
  getEpisodeNumber(): number;

  /**
   * Returns the MAL identification id from the url.
   */
  getMalId(): Promise<number>;
};
