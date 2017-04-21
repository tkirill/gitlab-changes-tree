(function (global) {
    function PathNode(nodeText) {
        const _this = this;
        let children = [],
            text = nodeText,
            url = null;

        this.addChild = function(pathInfo) {
            // set URL at the last node in the branch
            if (pathInfo.parts.length === 0) {
                url = pathInfo.url;
                return;
            }

            let matchedChild = _this.findChild(pathInfo.parts[0]);
            if (!matchedChild) {
                matchedChild = new PathNode(pathInfo.parts[0]);
                children.push(matchedChild);
            }

            // recursion is more readable and is good enough for expected input size
            matchedChild.addChild({
                parts: pathInfo.parts.slice(1),
                url: pathInfo.url
            });
        };

        this.findChild = function (text) {
            return children.find(function (x) {
                return x.getText() === text;
            });
        };

        // Merge parent and single child.
        this.collapse = function () {
            while (children.length === 1) {
                let singleChild = children[0];
                text = `${text}/${singleChild.getText()}`;
                url = singleChild.getUrl();
                children = singleChild.getChildren();
            }
            children.forEach(x => x.collapse());
        };

        // Sort children ascending
        //
        // Sort only by name, don't take path length into account.
        this.sort = function () {
            children.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            children.forEach(x => x.sort());
        };

        this.getText = function () {
            return text;
        };

        this.getUrl = function () {
            return url;
        };

        this.getChildren = function () {
            return children.slice();
        };

        this.toObject = function () {
            let result = {
                text: text,
                url: url,
                children: children.map(x => x.toObject())
            };
            if (url) {
                result.a_attr = {
                    href: url
                };
            }
            return result;
        }
    }

    function PathTree() {
        let root = new PathNode('.');

        this.addPath = function (pathInfo) {
            root.addChild(pathInfo);
        };

        this.collapse = function () {
            root.collapse();
        };

        this.sort = function () {
            root.sort();
        };

        this.toObject = function () {
            let result = root.toObject();
            result.state = {opened: true};
            return result;
        }
    }
    
    function buildTree(files) {
        let tree = new PathTree();
        
        files.forEach(function (x) {
            tree.addPath({
                // renames have pattern `old → new` -- we take the old file name
                parts: x.file.split('→')[0].trim().split('/'),
                url: x.url
            })
        });
        tree.collapse();
        tree.sort();

        return tree;
    }

    global.buildTree = buildTree;
})(window);