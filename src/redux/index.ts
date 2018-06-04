import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {applyMiddleware, createStore} from 'redux';
import {rootReducer} from './reducers';
import {fetchPosts, selectSubreddit} from './actions';

const loggerMiddleware = createLogger();

const store = createStore(rootReducer, applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
));

store.dispatch(selectSubreddit('reactjs'));
store.dispatch<any>(fetchPosts('reactjs'))
    .then(() => console.log(store.getState()));
