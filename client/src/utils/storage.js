export const setLocalStorage = (data) => {
    window.localStorage.setItem(
        'hh.auth', JSON.stringify(data)
    )
}

export const getAccessToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('hh.auth'));
    if (auth) {
      return auth.access;
    }
    return undefined;
  };

  export const getRefreshToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('hh.auth'));
    if (auth) {
      return auth.refresh;
    }
    return undefined;
  };