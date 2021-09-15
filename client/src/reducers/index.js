import { combineReducers } from 'redux';
import systemReducer from './systemReducer';
import processReducer from './processReducer';

export default combineReducers({
	sysData: systemReducer,
	processData: processReducer,
});
