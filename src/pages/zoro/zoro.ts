import { malIdUpdated, selectMalId } from '../../data';
import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import { ZoroSyncData } from './zoro.types';
import metadata from './metadata.json';

export class Zoro extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getSyncData(): ZoroSyncData {
    return JSON.parse(document.getElementById('syncData')?.textContent ?? '{}');
  }

  getTitle(): string {
    return this.getSyncData().name;
  }

  getIdentifier(): string {
    return this.getSyncData().anime_id;
  }

  getRawEpisodeNumber(): number {
    return this.getSyncData().episode;
  }

  getMalId(): Promise<number> {
    let malId = selectMalId(this.store.getState());

    // Redirection rules applied.
    if (malId > 0) {
      return Promise.resolve(malId);
    }

    malId = this.store.dispatch(
      malIdUpdated(parseInt(this.getSyncData().mal_id, 10) || 0)
    ).payload;

    return Promise.resolve(malId);
  }
}
