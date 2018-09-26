const roles = {a: 'administrator', e: 'editor', v: 'viewer'};

const parsePermissions = (perms)=>{
  // Permissions are encoded as 'a:project1,project2;v:project3'
  let permissions = perms.split(/;/).map(perm => {
    let [ role, projects ] = perm.split(/:/);
    role = roles[role.toLowerCase()];
    return projects.split(/,/).map(
      project_name=>({role, project_name})
    )
  }).reduce((perms,perm) => perms.concat(perm), []);

  return permissions;
}

const parseToken = (token)=>{
  let [header, params, signature] = token.split(/\./);
  let {email, first, last, perm} = JSON.parse(atob(params));

  return {
    email,
    first,
    last,
    permissions: parsePermissions(perm)
  };
}

const tabs = (old_tabs = {}, action)=>{
  switch(action['type']) {
    case 'ADD_TAB':

      if(old_tabs['tabs']) old_tabs = old_tabs['tabs'];

      return {
        ...old_tabs,
        [action.tab_name]: action.tab
      };
    default:
      return old_view;
  }
};

const views = (old_views = {}, action)=>{
  switch(action.type){
    case 'ADD_TAB':
      return {
        ...old_views,
        [action.view_name]: {
          tabs: tabs(old_views[action.view_name], action)
        }
      };
    case 'ADD_VIEW':
      return {
        ...old_views,
        [action.view_name]: action.view
      };
    case 'REFRESH_VIEWS':
      return {
        ...action.views
      };
    default:
      return old_views;
  }
};

const appReducer = function(app_data, action){
  if(!app_data){
    app_data = {
      messages: []
    }
  };

  switch(action.type) {
    case 'ADD_TAB':
    case 'ADD_VIEW':
    case 'REFRESH_VIEWS':
      return {
        ...app_data,
        views: views(app_data.views, action)
      };
    case 'TOGGLE_CONFIG':
      return {
        ...app_data,
        [action.key]: app_data.hasOwnProperty(action.key) ? !app_data[action.key] : true
      };
    case 'ADD_TOKEN_USER':
      return {
        ...app_data,
        user: parseToken(action.token)
      };
    case 'SET_PATH':
      return {
        ...app_data,
        path: action.path
      };
    case 'SHOW_MESSAGES':
      return {
        ...app_data,
        messages: app_data.messages.concat(action.messages)
      };
    case 'DISMISS_MESSAGES':
      return {
        ...app_data,
        messages: []
      };
    default:
      return app_data;
  }
}

export default appReducer;
