interface Page {
  hostname: string;
  pathname: string;

  getProviderName(): string;
  getIdentifier(): string;
  getEpisodeNumber(): number;
}

export default Page;
