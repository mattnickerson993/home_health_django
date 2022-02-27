export const getUser = () => {
    const auth = JSON.parse(window.localStorage.getItem('hh.auth'));
    if (auth) {
        const [,payload,] = auth.access.split('.')
        const decoded = window.atob(payload);
        const {id, email, first_name, last_name, group } = JSON.parse(decoded)
        return {id, email, first_name, last_name, group}
    }
    return undefined
}   