import * as _codemirror_state from '@codemirror/state';
import { Facet } from '@codemirror/state';

interface InteractRule {
    regexp: RegExp;
    cursor?: string;
    style?: any;
    onClick?: (text: string, setText: (t: string) => void, e: MouseEvent) => void;
    onDrag?: (text: string, setText: (t: string) => void, e: MouseEvent) => void;
}
/**
 * A rule that defines a type of value and its interaction.
 *
 * @example
 * ```
 * // a number dragger
 * interactRule.of({
 *     // the regexp matching the value
 *     regexp: /-?\b\d+\.?\d*\b/g,
 *     // set cursor to 'ew-resize'on hover
 *     cursor: 'ew-resize'
 *     // change number value based on mouse X movement on drag
 *     onDrag: (text, setText, e) => {
 *         const newVal = Number(text) + e.movementX;
 *         if (isNaN(newVal)) return;
 *         setText(newVal.toString());
 *     },
 * })
 * ```
 */
declare const interactRule: Facet<InteractRule, readonly InteractRule[]>;
declare const interactModKey: Facet<ModKey, ModKey>;
declare type ModKey = "alt" | "shift" | "meta" | "ctrl";
interface InteractConfig {
    rules?: InteractRule[];
    key?: ModKey;
}
declare const interact: (cfg?: InteractConfig) => _codemirror_state.Extension[];

export { InteractRule, interact as default, interactModKey, interactRule };
