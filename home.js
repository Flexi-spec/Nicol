const ably = new Ably.Realtime('n71aDg.Orkzww:R1GM_0-1pINgPGPiP5qeBSb7UiPT2VKNLXRRgB5xCAo');
const channel = ably.channels.get('video-app');

const videoFeed = document.getElementById('videoFeed');

function createVideoCard(data) {
  const card = document.createElement('div');
  card.className = 'video-card';
  
  const video = document.createElement('video');
  video.src = data.url;
  video.autoplay = true;
  video.loop = true;
  video.muted = false;
  
  const actions = document.createElement('div');
  actions.className = 'video-actions';
  
  const likeBtn = document.createElement('button');
  likeBtn.className = 'itlic';
  likeBtn.innerText = `❤️ ${data.likes || 0}`;
  likeBtn.onclick = () => channel.publish('like', {id: data.id});

  const shareBtn = document.createElement('button');
  shareBtn.className = 'itlic';
  shareBtn.innerText = '🔗';
  shareBtn.onclick = () => {
    navigator.clipboard.writeText(data.url);
    alert('Video URL copied!');
  };
  
  actions.appendChild(likeBtn);
  actions.appendChild(shareBtn);
  card.appendChild(video);
  card.appendChild(actions);

  // Comment section
  const commentSection = document.createElement('div');
  commentSection.className = 'comment-section';
  card.appendChild(commentSection);

  // Listen for comments
  channel.subscribe('comment', msg => {
    if(msg.data.videoId === data.id){
      const c = document.createElement('div');
      c.className = 'comment itlic';
      c.innerText = msg.data.text;
      commentSection.appendChild(c);
      // Animate comment like TikTok
      setTimeout(() => c.remove(), 5000);
    }
  });

  // Add comment on double click
  video.addEventListener('dblclick', () => {
    const text = prompt('Write a comment:');
    if(text){
      channel.publish('comment', {videoId: data.id, text});
    }
  });

  videoFeed.appendChild(card);

  // Auto-scroll to the newest video
  card.scrollIntoView({ behavior: 'smooth' });
}

// Listen for new videos
channel.subscribe('new-video', msg => createVideoCard(msg.data));

// Listen for likes
channel.subscribe('like', msg => {
  const cards = document.querySelectorAll('.video-card');
  cards.forEach(card => {
    const vid = card.querySelector('video');
    if(vid.src === msg.data.url){
      const btn = card.querySelector('button.itlic');
      btn.innerText = `❤️ ${msg.data.likes}`;
    }
  });
});
