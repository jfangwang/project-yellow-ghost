import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './Reducers/rootReducer';
import {MetaTags} from 'react-meta-tags';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
    rootReducer, composeEnhancers(applyMiddleware()),
);


ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <MetaTags>
          <title>Yellow Ghost</title>
          <meta
            name = "viewport"
            // eslint-disable-next-line max-len
            content = "width=device-width, minimum-scale=1.0, maximum-scale= 1.0, user-scalable=no"
          />
        </MetaTags>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
