let ejusticeURL = '';
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(sender.tab ?
            'from a content script:' + sender.tab.url :
            'from the extension');
        console.log(request);
        if (request.ejusticeurl) {
            sendResponse({farewell: 'goodbye'});
        }
    });
