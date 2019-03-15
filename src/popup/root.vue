<template>
    <div id="popup">
        <el-card shadow="never">
            <h5 class="font-size-18 font-weight-normal margin-tb-1-rem">Tabs status</h5>
            <div class="tabs-container">
                <el-row>
                    <el-col :span="8">
                        <div class="tab-circle border-circle vertical-center flex-wrap auto-margin">
                            <span class="tab-num width-full font-size-24 text-align-center line-height-15"
                                  v-text="tabsAllCount">0</span>
                            <span class="tab-type-text width-full text-align-center font-size-12">All</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="tab-circle border-circle vertical-center flex-wrap auto-margin">
                            <span class="tab-num width-full font-size-24 text-align-center line-height-15"
                                  v-text="tabsNormalCount">0</span>
                            <span class="tab-type-text width-full text-align-center font-size-12">Active</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="tab-circle border-circle vertical-center flex-wrap auto-margin">
                            <span class="tab-num width-full font-size-24 text-align-center line-height-15"
                                  v-text="tabsSleepingCount">0</span>
                            <span class="tab-type-text width-full text-align-center font-size-12">Sleep</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
<script>
    import TabManage from '../backend/index'

    export default {
        data: () => ({
            tabs: [],
            tabManage: null
        }),
        computed: {
            tabsAllCount() {
                return this.tabs.length
            },
            tabsSleepingCount() {
                let count = 0
                for (var i in this.tabManage.items) {
                    if (this.tabManage.items[i].isSleeping) {
                        count += 1
                    }
                }
                return count
            },
            tabsNormalCount() {
                return this.tabsAllCount - this.tabsSleepingCount
            }
        },
        created() {
            this.tabManage = new TabManage()
        },
        mounted() {
            this.init()
        },
        methods: {
            async init() {
                await this.loadTabs()
            },
            async loadTabs() {
                await chrome.tabs.query({}, tabs => {
                    this.tabs = tabs
                })
            }
        }
    }
</script>
<style lang="scss">
    #popup {
        width: 360px;
        min-height: 220px;

        .el-card {
            min-height: 220px;

            .el-card__body {
                padding-top: 0;
            }
        }

        .tabs-container {
            .tab-circle {
                padding: 5px;
                width: 60px;
                height: 60px;
                border: 1px solid transparent;
            }

            .el-col:nth-child(1) .tab-circle {
                border-color: #3469FC;
            }

            .el-col:nth-child(2) .tab-circle {
                border-color: #F5A623;
            }

            .el-col:nth-child(3) .tab-circle {
                border-color: #B7B7B7;
            }
        }
    }
</style>