'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var view = require('@codemirror/view');
var language = require('@codemirror/language');
var state = require('@codemirror/state');

const indentationMark = view.Decoration.mark({
    class: 'cm-indentation-marker',
    tagName: 'span',
});
const activeIndentationMark = view.Decoration.mark({
    class: 'cm-indentation-marker active',
    tagName: 'span',
});
/**
 * Widget used to simulate N indentation markers on empty lines.
 */
class IndentationWidget extends view.WidgetType {
    constructor(numIndent, indentSize, activeIndent) {
        super();
        this.numIndent = numIndent;
        this.indentSize = indentSize;
        this.activeIndent = activeIndent;
    }
    eq(other) {
        return (this.numIndent === other.numIndent &&
            this.indentSize === other.indentSize &&
            this.activeIndent === other.activeIndent);
    }
    toDOM(view) {
        const indentSize = language.getIndentUnit(view.state);
        const wrapper = document.createElement('span');
        wrapper.style.top = '0';
        wrapper.style.left = '4px';
        wrapper.style.position = 'absolute';
        wrapper.style.pointerEvents = 'none';
        for (let indent = 0; indent < this.numIndent; indent++) {
            const element = document.createElement('span');
            element.className = 'cm-indentation-marker';
            element.classList.toggle('active', indent === this.activeIndent);
            element.innerHTML = ' '.repeat(indentSize);
            wrapper.appendChild(element);
        }
        return wrapper;
    }
}
/**
 * Returns the number of indentation markers a non-empty line should have
 * based on the text in the line and the size of the indent.
 */
function getNumIndentMarkersForNonEmptyLine(text, indentSize, onIndentMarker) {
    let numIndents = 0;
    let numConsecutiveSpaces = 0;
    let prevChar = null;
    for (let char = 0; char < text.length; char++) {
        // Bail if we encounter a non-whitespace character
        if (text[char] !== ' ' && text[char] !== '\t') {
            // We still increment the indentation level if we would
            // have added a marker here had this been a space or tab.
            if (numConsecutiveSpaces % indentSize === 0 && char !== 0) {
                numIndents++;
            }
            return numIndents;
        }
        // Every tab and N space has an indentation marker
        const shouldAddIndent = prevChar === '\t' || numConsecutiveSpaces % indentSize === 0;
        if (shouldAddIndent) {
            numIndents++;
            if (onIndentMarker) {
                onIndentMarker(char);
            }
        }
        if (text[char] === ' ') {
            numConsecutiveSpaces++;
        }
        else {
            numConsecutiveSpaces = 0;
        }
        prevChar = text[char];
    }
    return numIndents;
}
/**
 * Returns the number of indent markers an empty line should have
 * based on the number of indent markers of the previous
 * and next non-empty lines.
 */
function getNumIndentMarkersForEmptyLine(prev, next) {
    const min = Math.min(prev, next);
    const max = Math.max(prev, next);
    // If only one side is non-zero, we add one marker
    // until the next non-empty line.
    if (min === 0 && max > 0) {
        return 1;
    }
    // If they're equal and nonzero then
    // take one less than the minimum
    if (min === max && min > 0) {
        return min - 1;
    }
    // Else, default to the minimum of the two
    return min;
}
/**
 * Returns the next non-empty line and its indent level.
 */
function findNextNonEmptyLineAndIndentLevel(doc, startLine, indentSize) {
    const numLines = doc.lines;
    let lineNo = startLine;
    while (lineNo <= numLines) {
        const { text } = doc.line(lineNo);
        if (text.trim().length === 0) {
            lineNo++;
            continue;
        }
        const indent = getNumIndentMarkersForNonEmptyLine(text, indentSize);
        return [lineNo, indent];
    }
    // Reached the end of the doc
    return [numLines + 1, 0];
}
/**
 * Adds indentation markers to all lines within view.
 */
function addIndentationMarkers(view$1) {
    const indentSize = language.getIndentUnit(view$1.state);
    const indentSizeMap = new Map();
    const decorations = [];
    for (const { from, to } of view$1.visibleRanges) {
        let pos = from;
        let prevIndentMarkers = 0;
        let nextIndentMarkers = 0;
        let nextNonEmptyLine = 0;
        while (pos <= to) {
            const line = view$1.state.doc.lineAt(pos);
            const { text } = line;
            // If a line is empty, we match the indentation according
            // to a heuristic based on the indentations of the
            // previous and next non-empty lines.
            if (text.trim().length === 0) {
                // To retrieve the next non-empty indentation level,
                // we perform a lookahead and cache the result.
                if (nextNonEmptyLine < line.number) {
                    const [nextLine, nextIndent] = findNextNonEmptyLineAndIndentLevel(view$1.state.doc, line.number + 1, indentSize);
                    nextNonEmptyLine = nextLine;
                    nextIndentMarkers = nextIndent;
                }
                const numIndentMarkers = getNumIndentMarkersForEmptyLine(prevIndentMarkers, nextIndentMarkers);
                // Add the indent widget and move on to next line
                indentSizeMap.set(line.number, numIndentMarkers);
                decorations.push({
                    from: pos,
                    to: pos,
                    lineNumber: line.number,
                    create: (activeIndentIndex) => view.Decoration.widget({
                        widget: new IndentationWidget(numIndentMarkers, indentSize, activeIndentIndex),
                    }),
                });
            }
            else {
                const indices = [];
                prevIndentMarkers = getNumIndentMarkersForNonEmptyLine(text, indentSize, (char) => indices.push(char));
                indentSizeMap.set(line.number, indices.length);
                decorations.push(...indices.map((char, i) => ({
                    from: line.from + char,
                    to: line.from + char + 1,
                    lineNumber: line.number,
                    create: (activeIndentIndex) => activeIndentIndex === i
                        ? activeIndentationMark
                        : indentationMark,
                })));
            }
            // Move on to the next line
            pos = line.to + 1;
        }
    }
    const activeBlockRange = getLinesWithActiveIndentMarker(view$1.state, indentSizeMap);
    return state.RangeSet.of(Array.from(decorations).map(({ lineNumber, from, to, create }) => {
        const activeIndent = lineNumber >= activeBlockRange.start &&
            lineNumber <= activeBlockRange.end
            ? activeBlockRange.activeIndent - 1
            : undefined;
        return { from, to, value: create(activeIndent) };
    }), true);
}
/**
 * Returns a range of lines with an active indent marker.
 */
function getLinesWithActiveIndentMarker(state, indentMap) {
    const currentLine = state.doc.lineAt(state.selection.main.head);
    let currentIndent = indentMap.get(currentLine.number);
    let currentLineNo = currentLine.number;
    // Check if the current line is starting a new block, if yes, we want to
    // start from inside the block.
    const nextIndent = indentMap.get(currentLineNo + 1);
    if (nextIndent && currentIndent != null && nextIndent > currentIndent) {
        currentIndent = nextIndent;
        currentLineNo++;
    }
    // Idem but if the current line is ending a block
    const prevIndent = indentMap.get(currentLineNo - 1);
    if (prevIndent && currentIndent != null && prevIndent > currentIndent) {
        currentIndent = prevIndent;
        currentLineNo--;
    }
    if (!currentIndent) {
        return { start: -1, end: -1, activeIndent: NaN };
    }
    let start;
    let end;
    for (start = currentLineNo; start >= 0; start--) {
        const indent = indentMap.get(start - 1);
        if (!indent || indent < currentIndent) {
            break;
        }
    }
    for (end = currentLineNo;; end++) {
        const indent = indentMap.get(end + 1);
        if (!indent || indent < currentIndent) {
            break;
        }
    }
    return { start, end, activeIndent: currentIndent };
}
function indentationMarkerViewPlugin() {
    return view.ViewPlugin.define((view) => ({
        decorations: addIndentationMarkers(view),
        update(update) {
            if (update.docChanged ||
                update.viewportChanged ||
                update.selectionSet) {
                this.decorations = addIndentationMarkers(update.view);
            }
        },
    }), {
        decorations: (v) => v.decorations,
    });
}
const indentationMarkerBaseTheme = view.EditorView.baseTheme({
    '.cm-line': {
        position: 'relative',
    },
    '.cm-indentation-marker': {
        display: 'inline-block',
    },
    '&light .cm-indentation-marker': {
        background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") left repeat-y',
    },
    '&light .cm-indentation-marker.active': {
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACAQMAAACjTyRkAAAABlBMVEX///+goKD0a5EfAAAADElEQVR4nGNgYGgAAACEAIHJde6SAAAAAElFTkSuQmCC) left repeat-y',
    },
    '&dark .cm-indentation-marker': {
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) left repeat-y',
    },
    '&dark .cm-indentation-marker.active': {
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACAQMAAACjTyRkAAAABlBMVEUAAACFhYWZv3sFAAAAAnRSTlMA/1uRIrUAAAAMSURBVHicY2BgaAAAAIQAgcl17pIAAAAASUVORK5CYII=) left repeat-y',
    },
});
function indentationMarkers() {
    return [indentationMarkerViewPlugin(), indentationMarkerBaseTheme];
}

exports.indentationMarkers = indentationMarkers;
