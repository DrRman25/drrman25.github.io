import {indentMore, indentLess} from "https://codemirror.net/try/mods/@codemirror-commands.js";

const insertTab = ({state, dispatch}) => {
    if (state.selection.ranges.some(r => !r.empty)) {
        return indentMore({state, dispatch});
    } else {
        dispatch(state.update(state.replaceSelection(localStorage.getItem("code-editor-editor-indentUnit")), {scrollIntoView: true, userEvent: "input"}));
    }
    return true;
}
const indentWithTab = {key: "Tab", run: insertTab, shift: indentLess};

export default indentWithTab;
