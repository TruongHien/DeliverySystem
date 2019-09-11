import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import counterApp from '../reducers/index';

const initialState = {
    user: null,
    count: 0,
};

export const store = createStore(counterApp, initialState, applyMiddleware(thunk));