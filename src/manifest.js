module.exports = {
    name: 'Sleep Page',
    version: '1.0.0',
    description: 'Automatically put unused pages into hibernation, save memory usage.',
    author: 'Jalin',
    manifest_version: 2,
    icons: {
        '16': 'icons/icon@16.png',
        '48': 'icons/icon@48.png',
        '128': 'icons/icon@128.png'
    },
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
