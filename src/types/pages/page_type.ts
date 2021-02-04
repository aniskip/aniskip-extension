interface Page {
  hostname: string;
  pathname: string;
  document: Document;

  getProviderName(): string;
  getIdentifier(): string;
  getEpisodeNumber(): number;
}

export default Page;
