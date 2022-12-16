/**
* Allows for Server-side and build time rendering of tokenized strings, and CSS rules so we end up with similar markup 
* and CSS styles as CodeMirror generates on the clientside.
*/

import {highlightTree, tags} from 'https://codemirror.net/try/mods/@lezer-highlight.js'
import { javascriptLanguage } from 'https://codemirror.net/try/mods/@codemirror-lang-javascript.js';
import { Decoration } from 'https://codemirror.net/try/mods/@codemirror-view.js';
import { RangeSetBuilder, Text } from 'https://codemirror.net/try/mods/@codemirror-state.js';
import { HighlightStyle } from 'https://codemirror.net/try/mods/@codemirror-language.js';

// Styles
const defaultHighlightStyle = HighlightStyle.define([
    {tag: tags.link, class: "tok-link"},
    {tag: tags.heading, class: "tok-heading"},
    {tag: tags.emphasis, class: "tok-emphasis"},
    {tag: tags.strong, class: "tok-strong"},
    {tag: tags.keyword, class: "tok-keyword"},
    {tag: tags.atom, class: "tok-atom" },
    {tag: tags.bool, class: "tok-bool"},
    {tag: tags.url, class: "tok-url"},
    {tag: tags.labelName, class: "tok-labelName"},
    {tag: tags.inserted, class: "tok-inserted"},
    {tag: tags.deleted, class: "tok-deleted"},
    {tag: tags.literal, class: "tok-literal"},
    {tag: [tags.string, tags.special(tags.string)], class: "tok-string"},
    {tag: tags.number, class: "tok-number"},
    {tag: [tags.regexp, tags.escape], class: "tok-string2"},
    {tag: tags.variableName, class: "tok-variableName"},
    {tag: tags.local(tags.variableName), class: "tok-variableName tok-local"},
    {tag: tags.special(tags.variableName), class: "tok-variableName2"},
    {tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], class: "tok-function"},
    {tag: tags.typeName, class: "tok-typeName"},
    {tag: tags.namespace, class: "tok-namespace"},
    {tag: tags.className, class: "tok-className"},
    {tag: tags.macroName, class: "tok-macroName"},
    {tag: tags.propertyName, class: "tok-propertyName"},
    {tag: tags.operator, class: "tok-operator"},
    {tag: tags.comment, class: "tok-comment"},
    {tag: tags.meta, class: "tok-meta"},
    {tag: tags.invalid, class: "tok-invalid"},
    {tag: tags.angleBracket, class: "tok-angleBracket"}
]);
const baseEditorStyles = "";  //

export function renderString(code, cfg = {}, highlightStyle=defaultHighlightStyle, theme) {
    code = code.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&nbsp;/g, ' ')
  var language = cfg.langProvider || javascriptLanguage; // js as default
  var tree = language.parser.parse(code);

  let markCache = {};

  let builder = new RangeSetBuilder();


  // 
  highlightTree(tree, highlightStyle, (from, to, style) => {
    builder.add(
      from,
      to,
      markCache[style] || (markCache[style] = Decoration.mark({ class: style }))
    );
  });

  // just the decorations NOT the code itself
  let decorationRangeSet = builder.finish();


  // just the code content. MUST be array of lines
  var text = Text.of(code.split('\n'));



  var str = '';
  var pos = 0; // keep track of pos

  // loop through each line of code we need to tokenize
  for (var i = 1; i <= text.lines; i++) {

    var line = text.line(i);

    // reset cursor position to beginning of current line
    pos = line.from;

    // iterate through the current line only
    var curs = decorationRangeSet.iter(line.from);
    // pos = line.from; // always start at beginning of the line


    //Q: Do we need to walk the cursor back to pos, or keep track of the tag that was started at the end of the last line?

    // as long as the iterator has a value, and we haven't reached the end of the current line, keep working  
    while (curs.value && curs.from < line.to) {

      //if the next token is after the current position, add the non-tokenized text to the string
      if (curs.from > pos) {
        str += `${text.sliceString(pos, curs.from).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/ /g, '&nbsp;')}`;
        // str += t.slice(pos, curs.from).join("");
      }

      // get token value from the current cursorPos to end of token (BUT NOT to extend the end of the current line)
      let codeVal = text.sliceString(curs.from, Math.min(curs.to, line.to)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/ /g, '&nbsp;');
      
      str += `<${curs.value.tagName} class="${curs.value.class}">${codeVal}</${curs.value.tagName}>`;
      pos = curs.to;

      // pos = Math.min(curs.to, line.to); // don't set pos beyond end of current line
      curs.next();


    }

    // catch up to end of line
    str += `${text.sliceString(pos, line.to)}`;
    pos = line.to; // set pos to end of line...
    // Q: do we need to reset the cursor too?
    
    str += "\n"; // closing cm-line div
  }


  var highlightStyles = extractCSSRulesFromThemeHighlightStyle(highlightStyle, theme);

  let gutterEl = '';
  let gutterClass = '';

  // assemble the gutter markup
  if (cfg.lineNumbers) {
    let gutterNumEl = '';
    
    for (let i=0; i<text.lines; i++) {
      gutterNumEl += `<div class="cm-gutterElement">${i+1}</div>`
    }
    gutterEl = `<div class="cm-gutters">
    <div class="cm-gutter cm-lineNumbers">${gutterNumEl}</div>
    </div>`

    gutterClass = 'gutter';
  }

  return {
    css: highlightStyles,
    code: `<div class="cm-editor ${gutterClass} ${highlightStyles.scopeClassName}"><div class="cm-scroller">${gutterEl}<div class="cm-content">${str}</div></div></div>`,
    codeLinesOnly: str
  }
}

// extracts the CSS style rules needed from the highlightStyle and theme passed in from the codeMirror theme
function extractCSSRulesFromThemeHighlightStyle(highlightStyle, theme = []) {
  const scopeClassName = theme[0]?.value || ''; // top level custom className for scoping added to `.cm-editor` wrapper el
  const rules = []; 

  // loop through the theme rules (esp for editor. Things like editor bg color, gutter color etc...)
  for(let i=1; i<theme.length; i++) {
    if (theme[i].value?.getRules?.()) {
      rules.push(theme[i].value.getRules()); 
    }
  }


  // add the highlighting rules, which is used for the tokenized code
  rules.push(highlightStyle);
  
  return {
    scopeClassName,
    highlightRules: rules,
    baseEditorStyles
  }
}