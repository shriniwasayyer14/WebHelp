/* globals elem */
jQuery.fn.extend({
    getPath: function () {
        var path, node = this;
        /*Include only names and IDs since you can always programmatically add/remove classes*/
        var uniqueTags = ['name', 'id'];
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) {
							break;
						}
            name = name.toLowerCase();

            var parent = node.parent();

            for (var i = uniqueTags.length - 1; i >= 0; i--) {
                var tag = uniqueTags[i];
                var tagValue = node.attr(tag);
                if (tagValue && (tagValue.trim !== '')) {
                    name += '[' + tag + '=\"' + tagValue + '\"]';
                }
            }

            var sameTagSiblings = parent.children(name);

            //As soon as you know you have sibling nodes, use nth-of-type so you can better find a unique match
            if (sameTagSiblings.length > 1) {
                var allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                name += ':nth-child(' + index + ')';
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    }
});

jQuery.fn.xpathEvaluate = function (xpathExpression) {
    // NOTE: vars not declared local for debug purposes
    var $this = this.first(); // Don't make me deal with multiples before coffee

    // Evaluate xpath and retrieve matching nodes
    var xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    var result = [];
    while (elem = xpathResult.iterateNext()) {
        result.push(elem);
    }

    var $result = jQuery([]).pushStack(result);
    return $result;
};