import {put, call} from 'redux-saga/effects';
import * as actions from '../actions/index';
import {delay} from 'redux-saga/effects';
import axios from 'axios';

//Saga generators 

export function* logoutSaga(action) { // generators in javascript
    yield call([localStorage, 'removeItem'], 'token');
    yield call([localStorage, 'removeItem'], 'expirationTime');
    yield call([localStorage, 'removeItem'], 'userId');
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.logout())
}

export function* authUserSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD-9OykuX2_2CiSQgpjU4aE5NbfxnUMCwA';
    if(!action.isSignup) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD-9OykuX2_2CiSQgpjU4aE5NbfxnUMCwA';
    }

    try{
        const response = yield axios.post(url, authData);
    
        const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
        yield localStorage.setItem('token', response.data.idToken);
        yield localStorage.setItem('expirationTime', expirationDate);
        yield localStorage.setItem('userId', response.data.localId)
        yield put(actions.authSuccess(response.data.idToken, response.data.localId));
        yield put(actions.checkAuthTimeout(response.data.expiresIn));
    } catch(err) {
        yield put(actions.authFail(err.response.data.error));
    }

}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
    if(!token) {
        yield put(actions.logout());
    } else {
        const expirationTime = yield new Date(localStorage.getItem('expirationTime'));
        if(expirationTime > new Date()) {
            const userId = yield localStorage.getItem('userId')
            yield put(actions.authSuccess(token, userId));
            yield put(actions.checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
        } else {
            yield put(actions.logout());
        }
    }
}