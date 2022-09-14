import { ViewPlugin, DecorationSet, ViewUpdate } from '@codemirror/view';
import { Extension } from '@codemirror/state';
export interface HyperLinkState {
    from: number;
    to: number;
    url: string;
}
export declare function hyperLinkExtension(): ViewPlugin<{
    decorations: DecorationSet;
    update(update: ViewUpdate): void;
}>;
export declare const hyperLinkStyle: Extension;
export declare const hyperLink: Extension;
