const processReducer = (state = [], action) => {
	switch (action.type) {
		case 'PROCESS_DATA':
			return action.payload;
		default:
			return state;
	}
};

export default processReducer;
