import { combineReducers } from "redux";
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;

//Store에 reducer(state의 마지막 변한값을 return)가 여러개가 있음. 기능별로 reducers 있음.
//이 여러개를 rootReducer에서 하나로 합침.