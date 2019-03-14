<template>
    <div id="popup">
        <el-card>
            <h5 class="action-title text-align-center">Tabs</h5>
            <div class="tabs-container">
                <el-row>
                    <el-col :span="8">
                        <div class="tab-circle border-circle vertical-center flex-wrap auto-margin">
                            <span class="tab-num width-full font-size-22 text-align-center"
                                  v-text="tabsAllCount">0</span>
                            <span class="tab-type-text width-full text-align-center font-size-14">All</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="tab-circle border-circle vertical-center flex-wrap auto-margin">
                            <span class="tab-num width-full font-size-22 text-align-center" v-text="tabsNormalCount">0</span>
                            <span class="tab-type-text width-full text-align-center font-size-14">Active</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="tab-circle border-circle vertical-center flex-wrap auto-margin">
                            <span class="tab-num width-full font-size-22 text-align-center"
                                  v-text="tabsSleepingCount">0</span>
                            <span class="tab-type-text width-full text-align-center font-size-14">Sleep</span>
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
        width: 400px;
        min-height: 300px;

        .el-card {
            min-height: 300px;
        }

        .tabs-container {
            .tab-circle {
                padding: 5px;
                width: 70px;
                height: 70px;
                border: 1px solid transparent;
            }

            .el-col:nth-child(1) .tab-circle {
                border-color: #88abf3;

                .tab-num {
                    color: #88abf3;
                }
            }

            .el-col:nth-child(2) .tab-circle {
                border-color: #a9fa82;

                .tab-num {
                    color: #a9fa82;
                }
            }

            .el-col:nth-child(3) .tab-circle {
                border-color: #fbd082;

                .tab-num {
                    color: #fbd082;
                }
            }
        }
    }
</style>