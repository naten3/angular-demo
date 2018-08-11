import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { LocalStorageService, SessionService } from 'app/core/services';
import { reducer } from 'app/core/store';
import { SaveEffects } from 'app/core/store/save/save.effects';
import { RestoreEffects } from 'app/core/store/restore/restore.effects';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    RouterStoreModule.connectRouter(),
    EffectsModule.run(SaveEffects),
    EffectsModule.run(RestoreEffects)
  ],
  exports: [],
  declarations: [],
  providers: [LocalStorageService, SessionService]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {}
}
