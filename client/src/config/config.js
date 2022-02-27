import { getAccessToken } from "../utils/storage"

export const headers = {
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

export const getAuthHeaders = () => {
    const accessToken = getAccessToken()
    const headers =  {
		Authorization: `${accessToken ? 'JWT ' + accessToken : null}`,
		'Content-Type': 'application/json',
		'accept': 'application/json',
	}

    return headers
}