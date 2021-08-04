import { createAction, props } from '@ngrx/store';

import { Profile } from '@models/profile.model';

export const setProfile = createAction(
    '[Profile] authSetProfile',
    props<{ profile: Profile }>()
);

export const logOut = createAction(
    '[Profile] authLogOut'
);

export const setPersistence = createAction(
    '[Profile] setPersistence'
);