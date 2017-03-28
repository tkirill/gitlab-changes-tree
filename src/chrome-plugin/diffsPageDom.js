(function (global){
    function htmlCollectionToArray(collection) {
        return [].slice.call(collection);
    }


    // Returns object that implements different required DOM queries.
    //
    // This object encapsulates all DOM queries so they stays at one place.
    function parseDiffsPageDom() {
        return {

            // Returns DOM element of the content of the Changes tab.
            getChangesTab: function () {
                return document.getElementsByClassName('diffs')[0];
            },


            // Checks if the element is `div.files-changed` element.
            //
            // `div.files-changed` contains list of changed files.
            isChangedFilesBlock: function (element) {
                return element && element.classList && element.classList.contains('files-changed');
            },

            // Extracts urls and names of changed files.
            //
            // Gets data from `a` tags inside `div.file-stats`.
            parseChangedFiles: function (changedFilesBlock) {
                var fileStatsDiv = changedFilesBlock.getElementsByClassName("file-stats")[0],
                    anchors = htmlCollectionToArray(fileStatsDiv.getElementsByTagName("a"));

                return anchors.map(function (x) {
                    return {url: x.href, file: x.text.trim()};
                });
            }
        }
    }

    global.parseDiffsPageDom = parseDiffsPageDom;
})(window);