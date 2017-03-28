(function() {
    console.log('plugin works');

    function htmlCollectionToArray(collection) {
        return [].slice.call(collection);
    }

    function isChangedFilesStrongElement(element) {
        if (element && element.tagName.toLowerCase() === 'strong') {
            return element.textContent.endsWith('changed files') || element.textContent.endsWith('changed file');
        }
        return false;
    }

    function isChangedFileToggleButton(element) {
        if (element && element.tagName === 'a' && element.className === 'js-toggle-button') {
            var strongs = element.getElementsByTagName('strong');
            return strongs.length === 1 && isChangedFilesStrongElement(strongs[0]);
        }
        return false;
    }

    function isChangedFiles(element) {
        return isChangedFilesStrongElement(element) || isChangedFileToggleButton(element);
    }

    function parseFileName(fileName) {
        var parts = fileName.split('/');
        return {parts: parts};
    }

    function getFiles() {
        var fileStatsDiv = document.getElementsByClassName("file-stats")[0],
            anchors = htmlCollectionToArray(fileStatsDiv.getElementsByTagName("a"));

        return anchors.map(function (x) {
            return parseFileName(x.text.trim());
        });
    }

    function onDiffsClick(e) {
        console.log('Clicked on:', e.target);
        if (!isChangedFiles(e.target)) {
            console.log('Clicked not on changed files');
            return;
        }

        var files = getFiles();
        console.log(files);
    }

    var diffsDiv = document.getElementsByClassName('diffs')[0];
    diffsDiv.addEventListener('click', onDiffsClick);
})();