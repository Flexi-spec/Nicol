const ably = new Ably.Realtime('n71aDg.Orkzww:R1GM_0-1pINgPGPiP5qeBSb7UiPT2VKNLXRRgB5xCAo');
const channel = ably.channels.get('video-app');

const uploadBtn = document.getElementById('uploadBtn');
const videoInput = document.getElementById('videoInput');

uploadBtn.addEventListener('click', () => {
  const file = videoInput.files[0];
  if (!file) return alert('Pick a video first!');

  const reader = new FileReader();
  reader.onload = () => {
    const videoData = { id: Date.now(), url: reader.result, likes: 0 };
    channel.publish('new-video', videoData);
    alert('Video posted!');
  };
  reader.readAsDataURL(file);
});
