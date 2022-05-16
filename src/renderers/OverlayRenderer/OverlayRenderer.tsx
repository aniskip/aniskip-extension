import React from 'react';
import { Provider } from 'react-redux';
import { Overlay } from '../../components';
import { Store } from '../../data';
import { Page } from '../../pages/base-page.types';
import { PageProvider, ShadowRootProvider } from '../../utils';
import { BaseRenderer } from '../base-renderer';

export class OverlayRenderer extends BaseRenderer {
  page: Page;

  store: Store;

  constructor(id: string, store: Store, page: Page) {
    super(id);

    this.store = store;
    this.page = page;
  }

  render(): void {
    this.reactRoot.render(
      <Provider store={this.store}>
        <PageProvider value={this.page}>
          <ShadowRootProvider value={this.shadowRoot}>
            <Overlay />
          </ShadowRootProvider>
        </PageProvider>
      </Provider>
    );
  }
}
