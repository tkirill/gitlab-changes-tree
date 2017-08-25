function save_options_chrome(options) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(options, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}


function load_options_chrome(options) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(options, r => {
            if (chrome.runtime.lastError) {
                console.log("OOOOPS.  " + chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                console.log('get OK.');
                console.log(r);
                resolve(r);
            }
        })
    });
}


function parse_plugin_options() {
    let urlListText = document.getElementById('url_list').value;
    return {
        customUrls: urlListText.split(/\r?\n/g).filter(x => x)
    };
}


function save_plugin_options() {
    let options = parse_plugin_options();
    save_options_chrome(options).then(() => {
        let status = document.getElementById('status');
        status.textContent = 'URLs saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 750);
    });
}


function restore_plugin_options() {
    console.log('start restoring ...');
    load_options_chrome({customUrls: []}).then(options => {
        let urlList = document.getElementById('url_list');
        urlList.value = options.customUrls.join('\n');
    });
}


document.addEventListener('DOMContentLoaded', restore_plugin_options);
document.getElementById('add').addEventListener('click', save_plugin_options);