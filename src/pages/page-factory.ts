import globToRegExp from 'glob-to-regexp';
import { Page } from './base-page.types';
import { AniMixPlay } from './animixplay';
import { Animepahe } from './animepahe';
import { Crunchyroll } from './crunchyroll';
import { Gogoanime } from './gogoanime';
import { NekoSama } from './nekosama';
import { Nineanime } from './nineanime';
import { Twistmoe } from './twistmoe';
import { Zoro } from './zoro';

export class PageFactory {
  static pages = [
    AniMixPlay,
    Animepahe,
    Crunchyroll,
    Gogoanime,
    NekoSama,
    Nineanime,
    Twistmoe,
    Zoro,
  ];

  /**
   * Obtains the page object from the domain.
   *
   * @param url Provider's host.
   */
  static getPage(url: string): Page {
    for (let i = 0; i < PageFactory.pages.length; i += 1) {
      const CurrentPage = PageFactory.pages[i];

      const metadata = CurrentPage.getMetadata();
      const { pageUrls } = metadata;

      for (let j = 0; j < pageUrls.length; j += 1) {
        const matcher = globToRegExp(pageUrls[j]);

        if (matcher.test(url)) {
          return new CurrentPage();
        }
      }
    }

    throw new Error(`Page ${url} not supported`);
  }
}
