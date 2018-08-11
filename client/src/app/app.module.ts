import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule, INITIAL_STATE } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { UserListContainerComponent, AdminUserListComponent, UserItemComponent } from 'app/admin-user-list';
import { TimeZoneComponent, TimeZoneItemComponent, AddUpdateTimeZoneComponent } from 'app/time-zones';
import { InviteUserComponent } from 'app/user-invite';
import { InvalidInviteComponent, NotFoundComponent } from 'app/error-page';

import { MyErrorHandler } from './error-handler';
import { CoreModule } from 'app/core/core.module';
import { routes } from 'app/app.routes';
import { SharedModule } from 'app/shared/shared.module';
import { LauncherContainerComponent, EmailVerifyComponent, HomeContainerComponent } from 'app/home';
import { AddUserComponent, SelfUpdateComponent, AdminUserUpdateComponent } from 'app/add-update-user';
import { AuthEffects, UserUpdateEffects, AdminUserListEffecs, UserInviteEffects, TimeZoneEffects, ToastEffects } from 'app/core/effects';
import { AuthGuard, LoginGuard, SocialLoginGuard, UserAdminGuard, AdminOrOwnerGuard } from 'app/core/guards';
import {
  EmailVerifyResolver,
  IdResolver,
  UserAdminListResolver,
  ManagedUserResolver,
  UserInviteResolver,
  TimeZoneResolver
} from 'app/core/resolve';

@NgModule({
  declarations: [
    AppComponent,
    HomeContainerComponent,
    LauncherContainerComponent,
    EmailVerifyComponent,
    AddUserComponent,
    SelfUpdateComponent,
    AdminUserUpdateComponent,
    UserListContainerComponent,
    AdminUserListComponent,
    UserItemComponent,
    InviteUserComponent,
    TimeZoneComponent,
    TimeZoneItemComponent,
    AddUpdateTimeZoneComponent,
    InvalidInviteComponent,
    NotFoundComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule,
    SharedModule,
    RouterModule.forRoot(routes, { useHash: true }),
    EffectsModule.run(AuthEffects),
    EffectsModule.run(UserUpdateEffects),
    EffectsModule.run(AdminUserListEffecs),
    EffectsModule.run(UserInviteEffects),
    EffectsModule.run(TimeZoneEffects),
    EffectsModule.run(ToastEffects),
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  providers: [
    { provide: ErrorHandler, useClass: MyErrorHandler },
    AuthGuard,
    LoginGuard,
    AdminOrOwnerGuard,
    UserAdminListResolver,
    SocialLoginGuard,
    UserAdminGuard,
    EmailVerifyResolver,
    IdResolver,
    ManagedUserResolver,
    UserInviteResolver,
    TimeZoneResolver
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
