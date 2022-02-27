import React from 'react'
import { api } from '../api'
import { AuthContext } from '../context'
import { getAccessToken } from '../utils/storage'
import axiosInstance from './axiosInstance'

const verifyUser = async () => {
    
    const accessToken = getAccessToken()

    if (accessToken){
        const res = await axiosInstance.post(api.auth.verify, {'token': accessToken})
        console.log('res', res)
        if (res.status === 200){
            return true
        }

    }
    return false
}

export default verifyUser