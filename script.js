var mediaConstraints = {
  optional: [],
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
  }
};

var offerer, answerer;
var offererToAnswerer = document.getElementById('peer1-to-peer2');
var answererToOfferer = document.getElementById('peer2-to-peer1');

window.RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.URL = window.webkitURL || window.URL;

window.iceServers = {
  iceServers: [{
    url: 'stun:stun.l.google.com:19302'
  }]
};

/* offerer */

function offererPeer(stream) {
  offerer = new RTCPeerConnection(window.iceServers);
  offerer.addStream(stream);

  offerer.onaddstream = function (event) {
    console.log(event)
    offererToAnswerer.srcObject = event.stream;
    // offererToAnswerer.src = URL.createObjectURL(event.stream);
    offererToAnswerer.play();
  };

  offerer.onicecandidate = function (event) {
    if (!event || !event.candidate) return;
    answerer.addIceCandidate(event.candidate);
  };

  offerer.createOffer(function (offer) {
    offerer.setLocalDescription(offer);
    answererPeer(offer, stream);
  }, onSdpError, mediaConstraints);
}


/* answerer */

function answererPeer(offer, stream) {
  answerer = new RTCPeerConnection(window.iceServers);
  answerer.addStream(stream);

  answerer.onaddstream = function (event) {
    console.log(event)
    answererToOfferer.srcObject = event.stream;
    // answererToOfferer.src = URL.createObjectURL(event.stream);
    answererToOfferer.play();
  };

  answerer.onicecandidate = function (event) {
    if (!event || !event.candidate) return;
    offerer.addIceCandidate(event.candidate);
  };

  answerer.setRemoteDescription(offer, onSdpSucces, onSdpError);
  answerer.createAnswer(function (answer) {
    answerer.setLocalDescription(answer);
    offerer.setRemoteDescription(answer, onSdpSucces, onSdpError);
  }, onSdpError, mediaConstraints);
}



function getUserMedia(callback) {
  navigator.getUserMedia({
    audio: true,
    video: true
  }, callback, onerror);

  function onerror(e) {
    console.error(e);
  }
}

getUserMedia(function (stream) {
  offererPeer(stream);
});

function onSdpError(e) {
  console.error('onSdpError', e);
}

function onSdpSucces() {
  console.log('onSdpSucces');
}