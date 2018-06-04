import {Action, ActionCreator, Dispatch} from 'redux';
import {IState} from './reducers';
import {ThunkAction} from 'redux-thunk';

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';
export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT';

export const selectSubreddit: ActionCreator<Action> = (subreddit: any) => {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    };
};

export const invalidateSubreddit: ActionCreator<Action> = (subreddit: any) => {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    };
};

export const requestsPosts: ActionCreator<Action> = (subreddit: any) => {
    return {
        type: REQUEST_POSTS,
        subreddit
    };
};

export const receivePosts: ActionCreator<Action> = (subreddit: any, json: any) => {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map((child: any) => child.data)
    };
};

export type MyThunkAction = ThunkAction<Promise<Action>, IState, void, Action>

export const fetchPosts: ActionCreator<MyThunkAction> = (subreddit: any) => {
    return (dispatch: Dispatch<Action>): Promise<Action> => {
        dispatch(requestsPosts(subreddit));
        return fetch(`https://www.reddit.com/r/${subreddit}.json`)
            .then(json => dispatch(receivePosts(subreddit, json)));
    };
};

function shouldFetchPosts(state: IState, subreddit: any) {
    const posts = state.postsBySubreddit[subreddit];
    if (!posts) {
        return true;
    } else if (posts.isFetching) {
        return false;
    } else {
        return posts.didInvalidate;
    }
}

export function fetchPostsIfNeeded(subreddit: any) {
    return (dispatch: any, getState: () => IState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            return dispatch(fetchPosts(subreddit));
        } else {
            return Promise.resolve();
        }
    };
}
