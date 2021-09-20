import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router.state';

import { Profile } from '@models/profile.model'

export interface AppState {
    profile: Profile;
    router: RouterReducerState<RouterStateUrl>;
}