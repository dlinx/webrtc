/* eslint-disable no-undef */
let myStream = null;
let peer = null;
const $myVideo = document.getElementById('source');
const $targetVideo = document.getElementById('target');
const $myId = document.getElementById('myId');
const $targetId = document.getElementById('targetId');
const $loginDiv = document.getElementById('loginDiv');
const $callDiv = document.getElementById('callDiv');
const $ctrlDiv = document.getElementById('ctrlDiv');
const $videos = document.getElementById('videos');

const init = () => {
  navigator.getUserMedia(
    {
      audio: true,
      video: false,
    },
    (_str) => {
      myStream = _str;
    },
    (err) => {
      console.log(err);
    }
  );
}

const login = () => {
  peer = new Peer($myId.value, {
    config: {
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
        {
          urls: ["turn:192.158.29.39:3478?transport=udp"],
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
      ],
    },
    secure: true,
    debug: 1,
    host: window.location.hostname,
    path: "/peer",
  });
  peer.on('call', (call) => {
    call.answer(myStream);
    $ctrlDiv.style.display = 'none';
    $videos.style.display = 'block';
    console.log('call answered')
    call.on('stream', (tStream) => {
      console.log('stream received')
      $targetVideo.srcObject = tStream;
    })
  });
  $loginDiv.style.display = 'none'
  $callDiv.style.display = 'block'
  $myVideo.srcObject = myStream;
}
const call = () => {
  const _call = peer.call($targetId.value, myStream);
  $ctrlDiv.style.display = 'none';
  $videos.style.display = 'block';
  _call.on("stream", (_remoteStr) => {
    $targetVideo.srcObject = _remoteStr;
  });
  _call.on("error", (e) => {
    console.log("call_error", e);
  });
  _call.on("close", () => {
    console.log("call disconnected");
  });
}
