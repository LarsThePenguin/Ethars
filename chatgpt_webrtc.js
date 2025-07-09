const chat = document.getElementById('chat');
const input = document.getElementById('messageInput');

const ws = new WebSocket('ws://' + window.location.host);
const peerConnection = new RTCPeerConnection();

let dataChannel;

// Handle WebSocket messages
ws.onmessage = async (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === 'offer') {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    ws.send(JSON.stringify(answer));
  } else if (msg.type === 'answer') {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
  } else if (msg.type === 'candidate') {
    await peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
  }
};

// Send ICE candidates to signaling server
peerConnection.onicecandidate = ({ candidate }) => {
  if (candidate) {
    ws.send(JSON.stringify({ type: 'candidate', candidate }));
  }
};

// Data channel for sending messages
dataChannel = peerConnection.createDataChannel("chat");

dataChannel.onmessage = (e) => {
  chat.value += "Peer: " + e.data + "\n";
};

peerConnection.ondatachannel = (event) => {
  event.channel.onmessage = (e) => {
    chat.value += "Peer: " + e.data + "\n";
  };
};

// Create and send offer
async function startConnection() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  ws.send(JSON.stringify(offer));
}

startConnection();

function sendMessage() {
  const message = input.value;
  chat.value += "Me: " + message + "\n";
  dataChannel.send(message);
  input.value = "";
}
