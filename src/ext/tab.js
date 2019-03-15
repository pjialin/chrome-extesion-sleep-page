/* eslint no-eval: 0 */
import TabManage from '../backend'

class Tab {
    id = 0
    lastActiveTime = 0
    lastActiveDate = 0
    title = ''
    url = ''
    favIconUrl = ''
    pinned = false
    isSleeping = false

    static newByTab(tab) {
        let _this = new Tab()
        _this.updateInfo(tab)
        _this.updateLastActiveTime()
        return _this
    }

    save() {
        let tabManage = new TabManage()
        tabManage.items[this.id] = this
        tabManage.saveTabItems()
    }

    updateInfo(tab) {
        this.id = tab.id
        this.title = tab.title
        this.url = tab.url
        this.favIconUrl = tab.favIconUrl
        this.pinned = tab.pinned
    }

    updateLastActiveTime() {
        this.lastActiveTime = Date.now() / 1000
        this.lastActiveDate = new Date()
        this.isSleeping = false
        this.save()
    }

    static restore(tab) {
        let _this = new Tab()
        for (var key in tab) {
            eval('_this.' + key + ' = tab[key]')
        }
        return _this
    }
}

export default Tab
