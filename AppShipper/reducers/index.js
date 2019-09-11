import { SET_USER, LOGOUT, SAVE_PROFILE, COUNT } from '../actions/types'

export default function counterApp(state = {}, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.user }
        case LOGOUT:
            state = {}
            return state
        case SAVE_PROFILE:
            return { ...state }
        case COUNT:
            return { ...state, count: action.count }
        default:
            return state
    }
}