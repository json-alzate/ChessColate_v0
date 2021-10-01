import { createSelector } from '@ngrx/store';


import { getProfileState } from '@redux/reducers/app.reducers';

export const getProfile = createSelector(
    getProfileState,
    getProfileState => getProfileState
);

export const getDarkMode = createSelector(
    getProfileState,
    profile => profile?.settings?.darkMode
);