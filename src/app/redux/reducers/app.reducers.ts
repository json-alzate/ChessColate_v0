import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { environment } from '@environments/environment';

import * as fromRouter from '@ngrx/router-store';

// reducers
import { profileReducer } from '@redux/reducers/profile.reducer';


// states
import { AppState } from '@redux/states/app.state';


// models
import { Profile } from '@models/profile.model';


export const appReducers: ActionReducerMap<AppState> = {
    profile: profileReducer,
    router: fromRouter.routerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

// getters for parts of the state
export const getProfileState = createFeatureSelector<Profile>('profile');