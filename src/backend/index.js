import storage from '../ext/storage'
import Tab from '../ext/tab'

// import sleepTemplate from '../../static/html/sleep.html'
let extensionUrl = chrome.extension.getURL('')

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
            this.syncTabItems()
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
                item.updateInfo(tab)
                if (item.url.indexOf('chrome') !== 0 && item.url.indexOf('view-source') !== 0) {
                    if (item.pinned || item.active) continue // Skip pinned and active tab
                    if (item.isSleeping) continue
                    let now = Date.now() / 1000
                    if (now - item.lastActiveTime > this.tabSleepInterval) { // go sleep
                        this.goSleep(item)
                    }
                }
                continue
            }
            item = Tab.newByTab(tab)
            item.save()
            this.loadTabItems()
        }
    }

    goSleep(item) {
        item.isSleeping = true
        this.saveTabItems()

        let data = {
            favIconUrl: item.favIconUrl,
            url: item.url,
            title: item.title,
            lastActiveDate: item.lastActiveDate
        }

        let dataStr = btoa(encodeURIComponent(JSON.stringify(data)))
        let url = extensionUrl + 'html/sleep.html?data=' + dataStr
        chrome.tabs.update(item.id, {url: url})

        // let code = `document.open(); document.write(\`<script>window.pageData = JSON.parse('` + JSON.stringify(data) + `');</script>` + sleepTemplate + `\`); document.close();`
        // chrome.tabs.executeScript(item.id, {'code': code})
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

    removeTab(id) {
        delete this.items[id]
        this.saveTabItems()
    }

    syncTabItems() {
        let tabIds = []
        let change = false

        this.tabs.forEach(res => {
            tabIds.push(res.id)
        })
        Object.keys(this.items).forEach(res => {
            if (!tabIds.includes(parseInt(res))) {
                change = true
                delete this.items[res]
            }
        })
        if (change) this.saveTabItems()
    }
}

let tabManage = new TabManage()

setInterval(() => {
    tabManage.runCycle()
}, 5000)
// tabManage.runCycle()

/** Event */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') { // refresh last change at
        let item = tabManage.items[tab.id]
        if (item && tab.url.indexOf(extensionUrl) !== 0) {
            item.updateInfo(tab)
            item.updateLastActiveTime()
        }
    }
})
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    tabManage.removeTab(tabId)
})

export default TabManage
