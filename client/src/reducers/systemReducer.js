const systemReducer = (state = [], action) => {
	switch (action.type) {
		case 'SYSTEM_DATA':
			return action.payload;
		default:
			return state;
	}
};

export default systemReducer;
