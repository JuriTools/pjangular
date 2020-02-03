const iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL('index.html');
iframe.style.height = '100%';
iframe.style.width = '100%';

const url = document.createElement('originalurl');
url.textContent = window.location.href;

console.log(iframe);
const currentFrame = document.querySelector('frameset');

currentFrame.parentNode.replaceChild(iframe, currentFrame);
document.head.append(url);
