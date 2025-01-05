async function loadBlockList() {
  const res = await chrome.storage.sync.get('blockList')
  return res['blockList'] || []
}

function handleChangedBlockList(changes, namespace) {
    if (changes['blockList']) {
      updateNavigationListener(changes['blockList'].newValue)
    }
}

function updateNavigationListener(blockList) {
    chrome.webNavigation.onCompleted.removeListener(blockAccess)

    if (blockList && blockList.length) {
      chrome.webNavigation.onCompleted.addListener(blockAccess, { url: blockList })
    }
}

function blockAccess(evt) {
    chrome.tabs.update(evt.tabId, {
      url: chrome.runtime.getURL("block.html")
    })
}

(async function main() {
    chrome.storage.onChanged.addListener(handleChangedBlockList)

    const blockList = await loadBlockList()
    updateNavigationListener(blockList)
})()