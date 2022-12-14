'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commands = require('@codemirror/commands');
var search = require('@codemirror/search');
var language = require('@codemirror/language');
var autocomplete = require('@codemirror/autocomplete');
var lint = require('@codemirror/lint');
var state = require('@codemirror/state');

const createAddCursor = (direction) => (view) => {
    const forward = direction === 'down';
    const selection = view.state.selection;
    for (const r of selection.ranges) {
        selection.addRange(view.moveVertically(r, forward));
    }
    view.dispatch({ selection });
    return true;
};
const addCursorUp = createAddCursor('up');
const addCursorDown = createAddCursor('down');
const addCursorAtEachSelectionLine = (view) => {
    for (const r of view.state.selection.ranges) {
        if (r.empty) {
            continue;
        }
        for (let pos = r.from; pos <= r.to;) {
            const line = view.state.doc.lineAt(pos);
            const anchor = Math.min(line.to, r.to);
            {
                state.EditorSelection.single(anchor);
            }
            pos = line.to + 1;
        }
    }
    {
        return false;
    }
};

const vscodeKeymap = [
    { key: 'Ctrl-Space', run: autocomplete.startCompletion },
    { key: 'Escape', run: autocomplete.closeCompletion },
    { key: 'ArrowDown', run: autocomplete.moveCompletionSelection(true) },
    { key: 'ArrowUp', run: autocomplete.moveCompletionSelection(false) },
    { key: 'PageDown', run: autocomplete.moveCompletionSelection(true, 'page') },
    { key: 'PageUp', run: autocomplete.moveCompletionSelection(false, 'page') },
    { key: 'Enter', run: autocomplete.acceptCompletion },
    { key: 'Tab', run: autocomplete.acceptCompletion },
    { key: 'Mod-f', run: search.openSearchPanel, scope: 'editor search-panel' },
    { key: 'Escape', run: search.closeSearchPanel, scope: 'editor search-panel' },
    { key: 'Alt-Enter', run: search.selectMatches, scope: 'editor search-panel' },
    { key: 'Mod-Alt-Enter', run: search.replaceAll, scope: 'editor search-panel' },
    { key: 'Ctrl-g', run: search.gotoLine },
    { key: 'Mod-d', run: search.selectNextOccurrence, preventDefault: true },
    { key: 'Shift-Mod-l', run: search.selectSelectionMatches },
    // Enter and shift enter handled within the search panel plugin
    { key: 'Enter', run: commands.insertNewlineAndIndent, shift: commands.insertNewlineAndIndent },
    {
        key: 'ArrowLeft',
        run: commands.cursorCharLeft,
        shift: commands.selectCharLeft,
        preventDefault: true,
    },
    {
        key: 'Mod-ArrowLeft',
        mac: 'Alt-ArrowLeft',
        run: commands.cursorGroupLeft,
        shift: commands.selectGroupLeft,
    },
    {
        key: 'ArrowRight',
        run: commands.cursorCharRight,
        shift: commands.selectCharRight,
        preventDefault: true,
    },
    {
        key: 'Mod-ArrowRight',
        mac: 'Alt-ArrowRight',
        run: commands.cursorGroupRight,
        shift: commands.selectGroupRight,
    },
    {
        key: 'ArrowUp',
        run: commands.cursorLineUp,
        shift: commands.selectLineUp,
        preventDefault: true,
    },
    {
        key: 'ArrowDown',
        run: commands.cursorLineDown,
        shift: commands.selectLineDown,
        preventDefault: true,
    },
    {
        key: 'Home',
        run: commands.cursorLineBoundaryBackward,
        shift: commands.selectLineBoundaryBackward,
    },
    {
        mac: 'Cmd-ArrowLeft',
        run: commands.cursorLineBoundaryBackward,
        shift: commands.selectLineBoundaryBackward,
    },
    { key: 'Mod-Home', run: commands.cursorDocStart, shift: commands.selectDocStart },
    { mac: 'Cmd-ArrowUp', run: commands.cursorDocStart, shift: commands.selectDocStart },
    { key: 'PageUp', run: commands.cursorPageUp, shift: commands.selectPageUp },
    { mac: 'Ctrl-ArrowUp', run: commands.cursorPageUp, shift: commands.selectPageUp },
    { key: 'PageDown', run: commands.cursorPageDown, shift: commands.selectPageDown },
    { mac: 'Ctrl-ArrowDown', run: commands.cursorPageDown, shift: commands.selectPageDown },
    {
        key: 'End',
        run: commands.cursorLineBoundaryForward,
        shift: commands.selectLineBoundaryForward,
    },
    {
        mac: 'Cmd-ArrowRight',
        run: commands.cursorLineBoundaryForward,
        shift: commands.selectLineBoundaryForward,
    },
    {
        key: 'Mod-Alt-ArrowUp',
        linux: 'Shift-Alt-ArrowUp',
        run: addCursorUp,
        preventDefault: true,
    },
    {
        key: 'Mod-Alt-ArrowDown',
        linux: 'Shift-Alt-ArrowDown',
        run: addCursorDown,
        preventDefault: true,
    },
    {
        key: 'Shift-Alt-i',
        run: addCursorAtEachSelectionLine,
    },
    { key: 'Mod-End', run: commands.cursorDocEnd, shift: commands.selectDocEnd },
    { mac: 'Cmd-ArrowDown', run: commands.cursorDocEnd, shift: commands.selectDocEnd },
    { key: 'Mod-a', run: commands.selectAll },
    { key: 'Backspace', run: autocomplete.deleteBracketPair },
    { key: 'Backspace', run: commands.deleteCharBackward, shift: commands.deleteCharBackward },
    { key: 'Delete', run: commands.deleteCharForward },
    { key: 'Mod-Backspace', mac: 'Alt-Backspace', run: commands.deleteGroupBackward },
    { key: 'Mod-Delete', mac: 'Alt-Delete', run: commands.deleteGroupForward },
    { mac: 'Mod-Backspace', run: commands.deleteToLineStart },
    { mac: 'Mod-Delete', run: commands.deleteToLineEnd },
    {
        mac: 'Ctrl-b',
        run: commands.cursorCharLeft,
        shift: commands.selectCharLeft,
        preventDefault: true,
    },
    { mac: 'Ctrl-f', run: commands.cursorCharRight, shift: commands.selectCharRight },
    { mac: 'Ctrl-p', run: commands.cursorLineUp, shift: commands.selectLineUp },
    { mac: 'Ctrl-n', run: commands.cursorLineDown, shift: commands.selectLineDown },
    { mac: 'Ctrl-a', run: commands.cursorLineStart, shift: commands.selectLineStart },
    { mac: 'Ctrl-e', run: commands.cursorLineEnd, shift: commands.selectLineEnd },
    { mac: 'Ctrl-d', run: commands.deleteCharForward },
    { mac: 'Ctrl-h', run: commands.deleteCharBackward },
    { mac: 'Ctrl-k', run: commands.deleteToLineEnd },
    { mac: 'Ctrl-Alt-h', run: commands.deleteGroupBackward },
    { mac: 'Ctrl-o', run: commands.splitLine },
    { mac: 'Ctrl-t', run: commands.transposeChars },
    { mac: 'Ctrl-v', run: commands.cursorPageDown },
    { mac: 'Alt-v', run: commands.cursorPageUp },
    { key: 'Shift-Mod-k', run: commands.deleteLine },
    { key: 'Alt-ArrowDown', run: commands.moveLineDown },
    { key: 'Alt-ArrowUp', run: commands.moveLineUp },
    { win: 'Shift-Alt-ArrowDown', mac: 'Shift-Alt-ArrowDown', run: commands.copyLineDown },
    { win: 'Shift-Alt-ArrowUp', mac: 'Shift-Alt-ArrowUp', run: commands.copyLineUp },
    { key: 'Mod-l', run: commands.selectLine, preventDefault: true },
    { key: 'Shift-Mod-\\', run: commands.cursorMatchingBracket },
    { key: 'Tab', run: commands.indentMore, shift: commands.indentLess, preventDefault: true },
    { key: 'Mod-[', run: commands.indentLess },
    { key: 'Mod-]', run: commands.indentMore },
    { key: 'Ctrl-Shift-[', mac: 'Cmd-Alt-[', run: language.foldCode },
    { key: 'Ctrl-Shift-]', mac: 'Cmd-Alt-]', run: language.unfoldCode },
    { key: 'Mod-k Mod-0', run: language.foldAll },
    { key: 'Mod-k Mod-j', run: language.unfoldAll },
    { key: 'Mod-k Mod-c', run: commands.lineComment },
    { key: 'Mod-k Mod-u', run: commands.lineUncomment },
    { key: 'Mod-/', run: commands.toggleComment },
    { key: 'Shift-Alt-a', run: commands.toggleBlockComment },
    { key: 'Mod-z', run: commands.undo, preventDefault: true },
    { key: 'Mod-y', run: commands.redo, preventDefault: true },
    { key: 'Mod-Shift-z', run: commands.redo, preventDefault: true },
    { key: 'Mod-u', run: commands.undoSelection, preventDefault: true },
    { key: 'Mod-Shift-m', run: lint.openLintPanel },
    { key: 'F8', run: lint.nextDiagnostic }, // Shift should go back, but previousDiagnostic is not implemented
];

exports.vscodeKeymap = vscodeKeymap;
