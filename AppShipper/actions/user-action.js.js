import { SET_USER, LOGOUT, SAVE_PROFILE, COUNT } from './types'

export const authLogin = (user) => {
    return {
        type: SET_USER,
        user: user
    }
}

export const logout = () => {
    return {
        type: LOGOUT,
        user: ''
    }
}

export const saveProfile = (user) => {
    return {
        type: SAVE_PROFILE,
        user: user
    }
}

export const count = (count) => {
    return {
        type: COUNT,
        count: count
    }
}

