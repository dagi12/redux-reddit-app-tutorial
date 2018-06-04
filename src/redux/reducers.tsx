import {INVALIDATE_SUBREDDIT, RECEIVE_POSTS, REQUEST_POSTS, SELECT_SUBREDDIT} from './actions';
import {AnyAction, combineReducers} from 'redux';

export interface IState {
    isFetching: boolean,
    didInvalidate: boolean,
    items: any[],
    postsBySubreddit: any
}

function selectedSubreddit(state = 'reactjs', action: AnyAction) {
    switch (action.type) {
        case SELECT_SUBREDDIT:
            return action.subreddit;
        default:
            return state;
    }
}

function posts(state: IState = {
    isFetching: false,
    didInvalidate: false,
    items: [],
    postsBySubreddit: null
}, action: AnyAction) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_POSTS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            });
        default:
            return state;
    }

}

function postsBySubreddit(state: IState, action: AnyAction) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
        case RECEIVE_POSTS:
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                [action.subreddit]: posts(state[action.subreddit], action)
            });
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    selectedSubreddit, postsBySubreddit
});
