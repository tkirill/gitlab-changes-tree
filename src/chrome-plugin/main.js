(function () {
    var dom = parseDiffsPageDom();
    var event = observeChangedFiles(dom);
    event.listen(function (eventArgs) {
        var files = dom.parseChangedFiles(eventArgs.getChangedFilesBlock());
        console.log(files);
    });
})();