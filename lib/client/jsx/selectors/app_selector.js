import * as Reselect from 'reselect';

const selectUser = (state)=>{
  if(!('user' in state.app)) return {};
  return state.app.user;
};

export const selectUserPermissions = Reselect.createSelector(
  selectUser,
  (user)=>{
    return ('permissions' in user) ? user.permissions : [];
  }
);
