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
                return x.text === text;
            });
        };

        this.toObject = function () {
            return {
                text: text,
                url: url,
                children: children.map(x => x.toObject())
            }
        }
    }

    function PathTree() {
        let root = new PathNode('.');

        this.addPath = function (pathInfo) {
            root.addChild(pathInfo);
        };

        this.toObject = function () {
            return root.toObject();
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

        return tree;
    }

    global.buildTree = buildTree;
})(window);