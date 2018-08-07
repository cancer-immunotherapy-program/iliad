const updateLocation = (link)=>{
  return {type: 'UPDATE_LOCATION', link};
};

export const pushLocation = (link)=>{
  return (dispatch)=>{
    history.pushState({}, '', link);
    dispatch(updateLocation(link));
  };
};

export const setLocation = (link)=>{
  return (dispatch)=>{
    history.replaceState({}, '', link);
    dispatch(updateLocation(link));
  };
};
