function saveOptions(evt) {
  const options = {
    'blockList': transformBlockListToFilterFormat(document.getElementById('blockList').value)
  }

  chrome.storage.sync.set(options)
  window.close()
}

async function restoreOptions() {
  const blockListResponse = await chrome.storage.sync.get('blockList')
  document.getElementById('blockList').value = transformBlockListToUIFormat(blockListResponse.blockList)
}

function transformBlockListToUIFormat(blockListInFilterFormat) {
  return blockListInFilterFormat.map(e => e.hostSuffix).join('\n')
}

function transformBlockListToFilterFormat(blockListInUIFormat) {
  return blockListInUIFormat.split('\n').filter(e => e.length).map(e => ({ hostSuffix: e }))
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)