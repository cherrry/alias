/* eslint-env browser */
/* global chrome */

let triggers = [];
const updateTriggers = function() {
  const identity = (url) => url;

  chrome.storage.sync.get(['aliases'], function({aliases}) {
    triggers = aliases.map(({alias, dest}) => {
      if (!/^[a-z]+\/?$/.test(alias)) {
        return identity;
      }
      if (!alias.endsWith('/')) {
        alias = alias + '/';
      }
      if (dest.indexOf('://') === -1) {
        dest = 'https://' + dest;
      }
      if (!dest.endsWith('/')) {
        dest = dest + '/';
      }
      const regexp = new RegExp('^(https?://)?' + alias);
      return (url) => {
        return url.replace(regexp, dest);
      };
    });
  });
};

chrome.storage.onChanged.addListener(updateTriggers);
updateTriggers();

const applyAliases = function({url}) {
  const newUrl = triggers.reduce((url, fn) => fn(url), url);
  if (newUrl !== url) {
    return {redirectUrl: newUrl};
  }
};

chrome.webRequest.onBeforeRequest.addListener(
  applyAliases,
  {urls: ['<all_urls>']},
  ['blocking']
);
