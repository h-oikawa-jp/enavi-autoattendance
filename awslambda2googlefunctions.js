"use strict";
/*
    Refs:
      - AWS Lambda http://docs.aws.amazon.com/lambda/latest/dg/programming-model.html
      - AWS Lambda https://cloud.google.com/functions/writing
      - rewrite-js https://github.com/chrisdickinson/rewrite-js
      - cssauron https://github.com/chrisdickinson/cssauron-falafel
      - falafel https://github.com/substack/node-falafel

    How to:

      > cat lambda_function.js | rewrite-js awslambda2googlefunctions.js > google_function.js
*/


function convertIentifiers(node) {

    //every "event" identifier becomes "data"

    switch (node.name) {

    case 'event':

        if (node.parent && node.parent.type === 'MemberExpression' && node.parent.property == node) {
            // special case ("event.event" -> "data.event")
            return;
        }

        node.update('data');

        break;

    }

}

function _swapList(nodeList) {
    // fetch names
    var names = nodeList.map(function (node) {
        return node.name;
    });

    // if both event and context in list
    if (names.indexOf('event') !== -1 && names.indexOf('context') !== -1) {

        // find them and swap their name

        nodeList.forEach(function (node) {

            switch (node.name) {

            case 'event':
                node.update('context');
                break;

            case 'context':
                node.update('data'); // directly "data" (not "event")
                break;
            }

        });
    }
}

function swapFunctionParams(node) {

    // if both event and context as params -> swap them

    _swapList(node.params);

}

function swapFunctionArgs(node) {

    // if both event and context as arguments -> swap them

    _swapList(node.arguments);

}

function _findByParent(node, type) {
    // recursively find node with parent of the given type
    if (node && node.parent && node.parent.type === type) {
        return node;
    }
    if (node && node.parent) {
        return _findByParent(node.parent, type);
    }
    return null;
}


function _commentStatementByNode(node) {
    // find the main block related to this node and comment it (should never be null)
    var block = _findByParent(node, 'BlockStatement');
    block.update("/* TODO: fix me!\n\t" + block.source() + "\n\t*/");
}


function convertFunctionLookup(node) {

    // look for context lookups

    switch (node.object.name) {

    case 'context':

        // map context methods

        switch (node.property.name) {

        case 'done':
            break;

        case 'succeed':
            node.property.update('success');
            break;

        case 'fail':
            node.property.update('failure');
            break;

        default:
            // comment everything else
            _commentStatementByNode(node);

        }

        break;
    }
}


module.exports = {
    'id': convertIentifiers,
    'function lookup': convertFunctionLookup,
    'function': swapFunctionParams,
    'call': swapFunctionArgs
};
