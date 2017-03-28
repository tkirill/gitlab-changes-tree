(function (global) {
    // Event that the list of changed files is loaded.
    function ChangesLoadEvent() {
        var callbacks = [];
        var triggered = false;


        // Adds callback to the event.
        //
        // Callback will be called in `global` context with single argument object of the form:
        //
        // {
        //   getChangedFilesBlock() -- get `div.files-changed`
        // }
        //
        // Callback will be called immediately if the event was already triggered.
        this.listen = function (callback) {
            if (triggered) {
                callback.call(global);
            } else {
                callbacks.push(callback);
            }
        };


        // Triggers the event and calls all callbacks.
        this.trigger = function (changedFilesBlock) {
            triggered = true;
            var eventArgs = {
                getChangedFilesBlock: function () {
                    return changedFilesBlock;
                }
            };

            callbacks.forEach(function (callback) {
                callback.call(global, eventArgs);
            });
        };
    }


    // Begin waiting for the list of changed files.
    //
    // List of changed files is loaded by AJAX query.  We observing DOM mutations on Changes tab and waiting for the
    // `div.files-changed` in DOM.
    function observeChangedFiles(pageDom) {
        var event = new ChangesLoadEvent();

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function (node) {
                    console.log(node);
                    if (pageDom.isChangedFilesBlock(node)) {
                        event.trigger(node);
                    }
                });
            });
        });

        var config = { attributes: true, childList: true, characterData: true };
        observer.observe(pageDom.getChangesTab(), config);

        return event;
    }

    global.observeChangedFiles = observeChangedFiles;
})(window);