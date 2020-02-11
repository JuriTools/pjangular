// create a body
const body = document.createElement('body');
body.style.overflow = 'hidden';

// create iframe and do some styling
const iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL('index.html');
iframe.name = window.location.href;
iframe.style.overflow = 'hidden';
iframe.style.display = 'block';
iframe.style.position = 'absolute';
iframe.style.height = '100%';
iframe.style.width = '99%';
iframe.style.borderWidth = '0';

body.append(iframe);
// Remove frameset containing shitty styled content
const oldFrame = document.querySelector('frameset');
const oldBody = document.querySelector('body');
if (oldFrame) {
    oldFrame.parentNode.removeChild(oldFrame);
} else if (oldBody) {
    oldBody.parentNode.removeChild(oldBody);
}

// Add body and appended frame to page
document.head.insertAdjacentElement('afterend', body);
