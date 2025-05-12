let socket: WebSocket | null = null;

export const connectWebSocket = (
  url: string,
  onMessage: (data: string) => void
) => {
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onmessage = (event) => {
    console.log('Received:', event.data);
    onMessage(event.data);
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const sendMessage = (msg: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(msg);
  } else {
    console.warn('WebSocket is not open');
  }
};

export const closeWebSocket = () => {
  if (socket) socket.close();
};