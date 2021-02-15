interface Page {
  hostname: string;

  pathname: string;

  document: Document;

  /**
   * Returns the provider name from the url
   */
  getProviderName(): string;

  /**
   * Returns the series identifier from the url
   */
  getIdentifier(): string;

  /**
   * Returns the episode number from the url
   */
  getEpisodeNumber(): number;
}

export default Page;
