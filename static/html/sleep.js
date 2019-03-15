let params = new URLSearchParams(location.search)
let data = params.get('data')
if (data) {
    data = JSON.parse(decodeURIComponent(atob(data)))
    let hash = '#load'
    if (window.location.hash == hash)
        reloadPage()
    else {
        window.history.replaceState({}, data.title, window.location.href + hash);
        updateFavicon()
    }
}

window.onload = function () {
    if (data) {
        document.title = '☽ ' + data.title
        data.lastActiveDate = new Date() // use real time
        document.querySelector('.top h1').innerText = data.title
        calculateDate()
    }
}

function updateFavicon() {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = data.favIconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
}


function reloadPage() {
    window.location.href = data.url
}

function calculateDate() {
    let now = new Date()
    let diffSecond = (now - new Date(data.lastActiveDate)) / 1000
    let second = prefixInteger(diffSecond % 60, 2),
        minutes = prefixInteger(diffSecond % 3600 / 60, 2),
        hour = prefixInteger(diffSecond / 3600, 2)
    let displayText = hour + ' : ' + minutes + ' : ' + second
    document.querySelector('.middle span').innerText = displayText
    setTimeout(calculateDate, 1000)
}

function prefixInteger(num, length) {
    return (Math.floor(num) / Math.pow(10, length)).toFixed(length).substr(2);
}

document.querySelector('.bottom').onclick = reloadPage