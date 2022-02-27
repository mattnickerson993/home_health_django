export const setLocalStorage = (data) => {
    window.localStorage.setItem(
        'hh.auth', JSON.stringify(data)
    )
}
