import storage from '../ext/storage'
import Tab from '../ext/tab'
import sleepTemplate from '../assets/html/sleep.html'

class TabManage {
    itemsKey = 'tab_items'
    tabs = []
    items = {}
    tabSleepInterval = 5

    constructor() {
        this.loadTabItems()
    }

    runCycle() {
        this.loadTabItems()
        this.getTabs(() => {
            this.checkTabs()
        })
    }

    getTabs(callback) {
        chrome.tabs.query({}, tabs => {
            this.tabs = tabs
            callback()
        })
    }

    /**
     * Check tab status
     * 1) Check tab exists, if not, save tab
     * 2) Check tab last active time, if gt the specified interval, make it go sleep
     *    if not, noting changes
     */
    checkTabs() {
        for (let i = 0; i < this.tabs.length; i++) {
            let tab = this.tabs[i]
            let item = this.items[tab.id]
            if (item) {
                if (item.url.indexOf('chrome') !== 0) {
                    console.log(0)
                    if (item.pinned || item.active) continue // Skip pinned and active tab
                    if (item.isSleeping) continue
                    console.log(1)
                    let now = Date.now() / 1000
                    if (now - item.lastActiveTime > this.tabSleepInterval) { // go sleep
                        this.goSleep(item)
                    }
                }
                continue
            }
            item = Tab.newByTab(tab) // TODO update latest tab status to item
            item.save()
            this.loadTabItems()
        }
    }

    goSleep(item) {
        // console.log(item.title, tab.id, tab.url, 'go sleep')
        item.isSleeping = true
        this.saveTabItems()

        let data = {
            title: 'Sleeping - ' + item.title
        }
        // JSON.parse('` + JSON.stringify(data) + `');`
        let code = `document.open(); document.write(\`<script>window.pageData = JSON.parse('` + JSON.stringify(data) + `');</script>` + sleepTemplate + `\`); document.close();`
        chrome.tabs.executeScript(item.id, {'code': code})
    }

    /**
     * Load all saved tabs from storage
     */
    loadTabItems() {
        let items = storage.get(this.itemsKey) || {}
        for (var key in items) {
            items[key] = Tab.restore(items[key])
        }
        this.items = items
    }

    saveTabItems() {
        storage.set(this.itemsKey, this.items)
    }
}

let tabManage = new TabManage()

setInterval(() => {
    tabManage.runCycle()
}, 1000)
// tabManage.runCycle()

/** Event */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') { // refresh last change at
        let item = tabManage.items[tab.id]
        if (item) item.updateLastActiveTime()
        console.log(tabId, changeInfo, tab)
    }
})

export default TabManage
