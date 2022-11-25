import {MatchDecorator, Decoration, EditorView, ViewPlugin, WidgetType} from "https://codemirror.net/try/mods/@codemirror-view.js";
import _optionalChain from "./optional-chain.js";

const imagePlaceholderMatcher = new MatchDecorator({
    regexp: /"data:image\/(apng|avif|bmp|gif|jpeg|png|svg+xml|tiff|webp|x-icon);base64,([^\s"]+)"/g,
    decoration: match => Decoration.replace({
        widget: new ImagePlaceholderWidget(match[0])
    })
});

const standardFilePlaceholderMatcher = new MatchDecorator({
    regexp: /"data:(application|audio|example|font|message|model|multipart|text|video)\/[\w;]*,([^\s"]+)"/g,
    decoration: match => Decoration.replace({
        widget: new StandardFilePlaceholderWidget(match[0])
    })
});

const imagePlaceholders = ViewPlugin.fromClass(class {
    constructor(view) {
        this.placeholders = imagePlaceholderMatcher.createDeco(view);
    }
    update(update) {
        this.placeholders = imagePlaceholderMatcher.updateDeco(update, this.placeholders);
    }
}, {
    decorations: instance => instance.placeholders,
    provide: plugin => EditorView.atomicRanges.of(view => {
        return _optionalChain([view, 'access', _ => _.plugin, 'call', _2 => _2(plugin), 'optionalAccess', _3 => _3.placeholders]) || Decoration.none;
    })
});

const standardFilePlaceholders = ViewPlugin.fromClass(class {
    constructor(view) {
        this.placeholders = standardFilePlaceholderMatcher.createDeco(view);
    }
    update(update) {
        this.placeholders = standardFilePlaceholderMatcher.updateDeco(update, this.placeholders);
    }
}, {
    decorations: instance => instance.placeholders,
    provide: plugin => EditorView.atomicRanges.of(view => {
        return _optionalChain([view, 'access', _ => _.plugin, 'call', _2 => _2(plugin), 'optionalAccess', _3 => _3.placeholders]) || Decoration.none;
    })
});

class ImagePlaceholderWidget extends WidgetType {
    constructor(name) {
        super();
        this.name = name;
    }
    eq(other) {
        return this.name == other.name;
    }
    toDOM() {
        let elt = document.createElement("img");
        elt.style.cssText = `max-width: 4rem; max-height: 16rem;`;
        elt.src = `${this.name.replace(/"/g, "")}`;
        return elt;
    }
    ignoreEvent() {
        return false;
    }
}

class StandardFilePlaceholderWidget extends WidgetType {
    constructor(name) {
        super();
        this.name = name;
    }
    eq(other) {
        return this.name == other.name;
    }
    toDOM() {
        let elt = document.createElement("a");
        elt.href = `javascript:navigator.clipboard.writeText(${this.name})`;
        elt.innerText = "Copy link to file";
        return elt;
    }
    ignoreEvent() {
        return false;
    }
}

const filePlaceholders = (() => [
    //standardFilePlaceholders,
    imagePlaceholders
])();

export default filePlaceholders;
