import _ from 'lodash';
import socket from '../socket/socketConnection';

export const fetchSystem = () => async (dispatch) => {
	await socket.on('data', (data) => {
		dispatch({ type: 'SYSTEM_DATA', payload: data });
	});
};

export const fetchProcess = () => async (dispatch) => {
	await socket.on('data', (data) => {
		dispatch({ type: 'PROCESS_DATA', payload: data });
	});
};

export const fetchSystemAndProcess = () => async (dispatch) => {
	await dispatch(fetchSystem());
	await dispatch(fetchProcess());

	// const macAs = _.uniq(_.map(getState().sysData, 'macA'));
	// macAs.forEach((id) => dispatch(fetchProcess));
};
