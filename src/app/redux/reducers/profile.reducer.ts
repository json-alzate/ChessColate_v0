import { createReducer, on, Action } from '@ngrx/store';
import { Profile } from '@models/profile.model';
import { logOut, setProfile } from '@redux/actions/profile.actions';

export const initialState: Profile | null = null;

export const iProfileReducer = createReducer(
    initialState,
    on(setProfile, (state, { profile }) => {
        return profile;
    }),

    on(logOut, () => {
        return null
    })
);

export function profileReducer(state: Profile | undefined, action: Action) {
    return iProfileReducer(state, action);
}