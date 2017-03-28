(function () {
    let dom = parseDiffsPageDom();
    let event = observeChangedFiles(dom);
    event.listen(function (eventArgs) {
        let files = dom.parseChangedFiles(eventArgs.getChangedFilesBlock());
        console.log(files);

        let tree = buildTree(files);
        console.log(tree.toObject());
    });
})();