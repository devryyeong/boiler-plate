import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import 'antd/dist/antd.css';
import {applyMiddleware, createStore} from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

//Promise와 Function도 받을 수 있도록 Middleware 필요.
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)

ReactDOM.render(
    <Provider
    store={createStoreWithMiddleware(Reducer,
        window.__REDUX__DEVTOOLS_EXTENSION__ &&
        window.__REDUX__DEVTOOLS_EXTENSION__()
        )}
    >
    <App />
    </Provider>
    ,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
