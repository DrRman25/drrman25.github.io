import InitialData from "./lib/initial-data.js";

/**
Set the site theme by default to light, for new users.
*/
if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

/**
Set the seasonal extras preference by default to false, for new users.
*/
if (!localStorage.getItem("code-editor-site-seasonalExtras")) {
    localStorage.setItem("code-editor-site-seasonalExtras", false);
}

/**
Add the site theme and seasonal extras attributes to the body element.
*/
document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));
document.body.setAttribute("seasonal-extras", localStorage.getItem("code-editor-site-seasonalExtras"));

const App = () => {
    const excalidrawRef = React.useRef(null);
    const excalidrawWrapperRef = React.useRef(null);
    const [dimensions, setDimensions] = React.useState({
        width: undefined,
        height: undefined
    });

    const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
    const [zenModeEnabled, setZenModeEnabled] = React.useState(false);
    const [gridModeEnabled, setGridModeEnabled] = React.useState(false);

    React.useEffect(() => {
        setDimensions({
            width: excalidrawWrapperRef.current.getBoundingClientRect().width,
            height: excalidrawWrapperRef.current.getBoundingClientRect().height
        });
        const onResize = () => {
            setDimensions({
                width: excalidrawWrapperRef.current.getBoundingClientRect().width,
                height: excalidrawWrapperRef.current.getBoundingClientRect().height
            });
        };

        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, [excalidrawWrapperRef]);

    const updateScene = () => {
        const sceneData = {
            elements: [
                {
                    type: "rectangle",
                    version: 141,
                    versionNonce: 361174001,
                    isDeleted: false,
                    id: "oDVXy8D6rom3H1-LLH2-f",
                    fillStyle: "hachure",
                    strokeWidth: 1,
                    strokeStyle: "solid",
                    roughness: 1,
                    opacity: 100,
                    angle: 0,
                    x: 100.50390625,
                    y: 93.67578125,
                    strokeColor: "#c92a2a",
                    backgroundColor: "transparent",
                    width: 186.47265625,
                    height: 141.9765625,
                    seed: 1968410350,
                    groupIds: []
                }
            ],
            appState: {
                viewBackgroundColor: "#edf2ff"
            }
        };
        console.log(excalidrawRef, "hello");
        excalidrawRef.current.updateScene(sceneData);
    };

    return React.createElement(
        React.Fragment,
        null,
        /*React.createElement(
            "div",
            { className: "button-wrapper" },
            React.createElement(
                "button",
                {
                    className: "update-scene",
                    onClick: updateScene
                },
                "Update Scene"
            ),
            React.createElement(
                "button",
                {
                    className: "reset-scene",
                    onClick: () => excalidrawRef.current.resetScene()
                },
                "Reset Scene"
            ),
            React.createElement(
                "label",
                null,
                React.createElement("input", {
                    type: "checkbox",
                    checked: viewModeEnabled,
                    onChange: () => setViewModeEnabled(!viewModeEnabled)
                }),
                "View mode"
            ),
            React.createElement(
                "label",
                null,
                React.createElement("input", {
                    type: "checkbox",
                    checked: zenModeEnabled,
                    onChange: () => setZenModeEnabled(!zenModeEnabled)
                }),
                "Zen mode"
            ),
            React.createElement(
                "label",
                null,
                React.createElement("input", {
                    type: "checkbox",
                    checked: gridModeEnabled,
                    onChange: () => setGridModeEnabled(!gridModeEnabled)
                }),
                "Grid mode"
            )
        ),*/
        React.createElement(
            "div",
            {
                className: "excalidraw-wrapper",
                ref: excalidrawWrapperRef
            },
            React.createElement(ExcalidrawLib.Excalidraw, {
                initialData: InitialData,
                ref: excalidrawRef,
                zenModeEnabled,
                gridModeEnabled,
                viewModeEnabled
            })
        )
    );
};

const excalidrawWrapper = document.getElementById("workspace");
const root = ReactDOM.createRoot(excalidrawWrapper);
root.render(React.createElement(App));
