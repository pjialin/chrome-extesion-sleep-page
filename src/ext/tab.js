/* eslint no-eval: 0 */
import TabManage from '../backend'

class Tab {
    id = 0
    lastActiveTime = 0
    lastActiveDate = 0
    title = ''
    url = ''
    pinned = false
    isSleeping = false

    static newByTab(tab) {
        let _this = new Tab()
        _this.id = tab.id
        _this.title = tab.title
        _this.url = tab.url
        _this.pinned = tab.pinned
        _this.updateLastActiveTime()
        return _this
    }

    save() {
        let tabManage = new TabManage()
        tabManage.items[this.id] = this
        console.log(this, tabManage.items)
        tabManage.saveTabItems()
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
