const puppeteer = require('puppeteer')

const EXTENSION_PATH = '../extension'
const EXTENSION_ID = 'pomgncmehljphlolnagmahaaondgaeah'

let browser;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`
    ]
  })
})

afterEach(async () => {
  await browser.close();
  browser = undefined;
})

test('options page correctly saves and restores empty configuration', async () => {
  await testSaveAndRestore('')
})

test('options page correctly saves and restores single item configuration', async () => {
  await testSaveAndRestore('example.org')
})

test('options page correctly saves and restores multiple item configuration', async () => {
  await testSaveAndRestore('example.org\nexample.com')
})

test('extension blocks pages', async () => {
  await configureExtension('example.org')
  await verifyBlock('example.org')
})

async function testSaveAndRestore(blockList) {
  await configureExtension(blockList)
  await verifyExtensionConfiguration(blockList)
}

async function configureExtension(blockList) {
  const initialPage = await openOptionsPage()
  const { blockListTextArea, saveButton } = await locatePageElements(initialPage)

  const initialBlockListValue = await blockListTextArea.map(e => e.value).wait()
  expect(initialBlockListValue.length).toBe(0)

  await blockListTextArea.fill(blockList)
  await saveButton.click()
}

async function verifyExtensionConfiguration(expectedBlockList) {
  const page = await openOptionsPage()
  const { blockListTextArea } = await locatePageElements(page)

  const blockListValue = await blockListTextArea.map(e => e.value).wait()
  expect(blockListValue).toBe(expectedBlockList)
}

async function verifyBlock(site) {
  const page = await browser.newPage()
  await page.goto(`http://${site}`)

  const blockParagraph = await page.locator('#blockText').setTimeout(1000).wait()
}

async function openOptionsPage() {
  const page = await browser.newPage()
  await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`)
  return page
}

async function locatePageElements(page) {
  const blockListTextArea = await page.locator('#blockList')
  const saveButton = await page.locator('#save')

  return { blockListTextArea, saveButton }
}