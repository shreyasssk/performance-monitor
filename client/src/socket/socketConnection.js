import io from 'socket.io-client';
let socket = io.connect('http://localhost:4000');
socket.emit('clientAuth', 'W7u7XZ2WCdf3U1N8T6dWLzI70Ug=');

export default socket;
