(function (global) {
    function renderTree(tree, dom) {
        let sidebar = dom.getSidebar();

        let jsTreeData = [tree.toObject()];

        let $treeBlock = $('<div>').addClass('block changed-files-tree-plugin').jstree({
            'core': {
                'data': jsTreeData,
                themes: {
                    icons: false
                }
            }
        }).on('activate_node.jstree', (e, data) => {
            console.log(data.node);
            window.location = data.node.a_attr.href;
        });

        sidebar.appendChild($treeBlock[0]);
    }

    global.renderTree = renderTree;
})(window);