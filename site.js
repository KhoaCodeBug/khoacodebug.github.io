const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll('video')];
const manuallyPaused = new WeakSet();
const automaticPauses = new WeakSet();
function pause(video) {
  if (!video.paused) { automaticPauses.add(video); video.pause(); }
}
for (const video of videos) {
  video.addEventListener('pause', () => {
    if (automaticPauses.has(video)) automaticPauses.delete(video);
    else manuallyPaused.add(video);
  });
  video.addEventListener('play', () => manuallyPaused.delete(video));
  if (reducedMotion.matches) { video.autoplay = false; pause(video); }
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const {target: video, isIntersecting} of entries) {
      if (!isIntersecting) pause(video);
      else if (!reducedMotion.matches && !manuallyPaused.has(video)) video.play().catch(() => {});
    }
  }, {threshold: 0.2});
  videos.forEach(video => observer.observe(video));
}
reducedMotion.addEventListener('change', event => {
  if (event.matches) videos.forEach(video => { video.autoplay = false; pause(video); });
});
