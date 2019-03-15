module.exports = {
    name: 'Vue Extension',
    version: '1.0.0',
    description: 'Vue.js Chrome Extension Template (wcer)',
    author: 'yura',
    manifest_version: 2,
    icons: {'16': 'icons/16.png', '128': 'icons/128.png'},
    permissions: [
        '<all_urls>',
        '*://*/*',
        'activeTab',
        'tabs',
        // 'cookies',
        'background',
        // 'contextMenus',
        'unlimitedStorage',
        'storage',
        // 'notifications',
        // 'identity',
        // 'identity.email'
    ],
    browser_action: {
        default_title: 'title',
        default_popup: 'pages/popup.html'
    },
    background: {
        persistent: false,
        page: 'pages/background.html'
    },
    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
}
