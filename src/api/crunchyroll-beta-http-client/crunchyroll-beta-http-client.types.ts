export type ServerSideDataFetching = {
  enabled: boolean;
  onEnterExecutionTimeout: number;
};

export type Logger = {
  enabled: boolean;
};

export type Debug = {
  enabled: boolean;
};

export type Options = {
  accountId: string;
  trustKey: string;
  agentId: string;
  licenseKey: string;
  applicationId: string;
};

export type BrowserMonitoring = {
  enabled: boolean;
  options: Options;
};

export type Newrelic = {
  enabled: boolean;
  browserMonitoring: BrowserMonitoring;
};

export type Drm = {
  dashRolloutPercent: number;
  fairplayCertificateUrl: string;
  playreadyCertificateUrl: string;
  widevineCertificateUrl: string;
};

export type Features = {
  adConfigId: string;
  oneAdPerMidroll: string;
  strictMode: string;
  vilosUrl: string;
  bypassOptInFlow: string;
  defaultLanguage: string;
  ssr: string;
  countryOverride: string;
  resetPassword: string;
  videoQualitySelector: string;
  overrideFeedId: string;
  overrideCarouselId: string;
  betaNotificationsPage: string;
  share: string;
  watchUpsell: string;
  evidon: string;
  clientApiDomain: string;
  watchAllEpisodes: string;
  accountStateEnforcement: string;
};

export type DarkFeatureConfig = {
  features: Features;
  storageKey: string;
  securedRoutes: any[];
};

export type CxApiParams = {
  apiDomain: string;
  accountAuthClientId: string;
  anonClientId: string;
};

export type RedirectRoute = {
  url: string;
  patterns: any[];
  statusCode: number;
};

export type PayPal = {
  env: string;
};

export type AppConfig = {
  reCaptchaKey: string;
  serverSideDataFetching: ServerSideDataFetching;
  logger: Logger;
  debug: Debug;
  newrelic: Newrelic;
  drm: Drm;
  darkFeatureConfig: DarkFeatureConfig;
  crunchyrollSiteUrl: string;
  staticDomain: string;
  assetsPath: string;
  assetsBuildPath: string;
  baseSiteUrl: string;
  baseStaticUrl: string;
  baseSsoUrl: string;
  vilosPlayerUrl: string;
  cancelHappyMealUrl: string;
  cxApiParams: CxApiParams;
  redirectRoutes: RedirectRoute[];
  authorizedRoutes: string[];
  payPal: PayPal;
  NODE_ENV: string;
};

export type PostResponseFromAuthV1 = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  country: string;
  account_id: string;
};

export type Cms = {
  bucket: string;
  policy: string;
  signature: string;
  key_pair_id: string;
  expires: Date;
};

export type GetResponseFromIndexV2 = {
  cms: Cms;
  service_available: boolean;
  default_marketing_opt_in: boolean;
};

export type Links = {};

export type Actions = {};

export type EpisodeSeason = {
  href: string;
};

export type EpisodeSeries = {
  href: string;
};

export type Resource = {
  href: string;
};

export type ResourceChannel = {
  href: string;
};

export type Streams = {
  href: string;
};

export type Links2 = {
  'episode/season': EpisodeSeason;
  'episode/series': EpisodeSeries;
  resource: Resource;
  'resource/channel': ResourceChannel;
  streams: Streams;
};

export type Actions2 = {};

export type Images = {
  thumbnail: any[][];
};

export type EpisodeMetadata = {
  series_id: string;
  series_title: string;
  series_slug_title: string;
  season_id: string;
  season_title: string;
  season_slug_title: string;
  season_number: number;
  episode_number: number;
  episode: string;
  sequence_number: number;
  duration_ms: number;
  episode_air_date: Date;
  is_premium_only: boolean;
  is_mature: boolean;
  mature_blocked: boolean;
  is_subbed: boolean;
  is_dubbed: boolean;
  is_clip: boolean;
  available_offline: boolean;
  maturity_ratings: string[];
  subtitle_locales: string[];
  availability_notes: string;
};

export type Item = {
  __class__: string;
  __href__: string;
  __links__: Links2;
  __actions__: Actions2;
  id: string;
  external_id: string;
  channel_id: string;
  title: string;
  description: string;
  promo_title: string;
  promo_description: string;
  type: string;
  slug: string;
  slug_title: string;
  images: Images;
  episode_metadata: EpisodeMetadata;
  playback: string;
  linked_resource_key: string;
};

export type GetResponseFromObjects = {
  __class__: string;
  __href__: string;
  __resource_key__: string;
  __links__: Links;
  __actions__: Actions;
  total: number;
  items: Item[];
};
