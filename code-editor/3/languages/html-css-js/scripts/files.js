const files = {
    "2048": `<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>2048</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    <style>
        body {
            text-align: center;
            background-image: linear-gradient(#282a35e6, #282a35e6), url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80");
            background-size: cover;
            background-position: center;
            width: calc(100vw - 1rem);
            height: calc(100vh - 1rem);
            color: white;
        }

        h1 {
            font-size: 3rem;
            margin: 1rem 0;
        }

        #game {
            width: 20rem;
            height: 20rem;
            background-color: black;
            margin: auto;
            padding: 0.5rem 0 0 0.5rem;
            border-radius: 1rem;
        }

        .square {
            width: 4rem;
            height: 4rem;
            margin: 0.375rem;
            background-color: #333;
            float: left;
            border-radius: 0.5rem;
        }

        .tile {
            width: 4rem;
            height: 4rem;
            color: white;
            text-align: center;
            position: absolute;
            line-height: 4rem;
            font-size: 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 0 1rem white;
            cursor: pointer;
        }

        .tile.s2 {
            background-color: #100;
        }

        .tile.s4 {
            background-color: #210;
        }

        .tile.s8 {
            background-color: #330;
        }

        .tile.s16 {
            background-color: #040;
        }

        .tile.s32 {
            background-color: #005;
        }

        .tile.s64 {
            background-color: #306;
        }

        .tile.s128 {
            background-color: #700;
        }

        .tile.s256 {
            background-color: #840;
        }

        .tile.s512 {
            background-color: #990;
        }

        .tile.s1024 {
            background-color: #0a0;
        }

        .tile.s2048 {
            background-color: #00b;
        }

        .tile.s4096 {
            background-color: #60c;
        }

        .tile.s8192 {
            background-color: #d00;
        }

        .tile.s16384 {
            background-color: #e70;
        }

        .tile.s32768 {
            background-color: #ff0;
        }

        #buttons, #buttons * {
            box-sizing: content-box;
        }

        #up, #left, #right, #down, button.control, a.control {
            background-color: #222;
            color: white;
            padding: 0.375rem;
            border: none;
            border-radius: 0.75rem;
            transition-duration: 0.2s;
            user-select: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        button.control {
            padding: 0.5rem;
        }

		#up:hover, #left:hover, #right:hover, #down:hover, button.control:hover, a.control:hover {
			background-color: #444;
		}

		#up:active, #left:active, #right:active, #down:active, button.control:active, a.control:active {
			background-color: #666;
			transform: scale(0.9);
		}

		#up:focus, #left:focus, #right:focus, #down:focus, button.control:focus, a.control:focus {
			box-shadow: 0 0 0.3125rem white;
			outline: none;
        }

        #up {
            display: block;
            margin: auto auto 0.5rem auto;
            margin-block-end: 0.5rem;
        }

        #left {
            margin-right: 3.5rem;
        }

        #down {
            display: block;
            margin: 0.5rem auto auto auto;
            margin-block-start: 0.5rem;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
</head>

<body>
    <div class="container-fluid mt-3">
        <h1>2048</h1>
        <div id="game">
            <div id="grid"></div>
            <div id="tiles"></div>
        </div>
        <div id="buttons" class="mt-3">
            <button id="up">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"></path>
				</svg>
            </button>
            <button id="left">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"></path>
				</svg>
            </button>
            <button id="right">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"></path>
				</svg>
            </button>
            <button id="down">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"></path>
				</svg>
            </button>
        </div>
    </div>
    <script>
        const board = [];

        $("#up").click(shiftUp);
        $("#left").click(shiftLeft);
        $("#right").click(shiftRight);
        $("#down").click(shiftDown);

        function createGrid() {
            for (i = 0; i < 4; i++) {
                const row = [];
                for (j = 0; j < 4; j++) {
                    row.push(new BoardTile(i, j));
                    $("#grid").append($("<div>", {class: "square"}));
                }
                board.push(row);
            }
        }

        function BoardTile() {
            this.value = 0;
            this.merged = false;
        }

        function addRandom() {
            let i, j;
            do {
                i = Math.floor(Math.random() * 4);
                j = Math.floor(Math.random() * 4);
            } while (board[i][j].value != 0);
            if (Math.floor(Math.random() * 10) < 2) {
                // If greater than two, set value to four
                board[i][j].value = 4;
            } else {
                // If less than or equal to two, set value to two
                board[i][j].value = 2;
            }
            let id = \`\${i}-\${j}\`;
            // Create tiles using jQuery
            $("#tiles").append($(\`<p class="tile s\${board[i][j].value}" id="\${id}"><strong>\${board[i][j].value}</strong></p>\`));
            $(\`#\${id}\`).css({
                "margin-left": \`\${.375 + j * 4.75}rem\`,
                "margin-top": \`\${.375 + i * 4.75}rem\`
            });
        }

        function init() {
            for (let i = 0; i < 2; i++) {
                // Create two starting tiles
                addRandom();
            }
        }

        // Re-draw tiles
        function reDrawTiles() {
            $("#tiles").empty();
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j].value != 0) {
                        let id = \`\${i}-\${j}\`;
                        $("#tiles").append($(\`<p class="tile s\${board[i][j].value}" id="\${id}"><strong>\${board[i][j].value}</strong></p>\`));
                        $(\`#\${id}\`).css({
                            "margin-left": \`\${.375 + j * 4.75}rem\`,
                            "margin-top": \`\${.375 + i * 4.75}rem\`
                        });
                    }
                }
            }
        }

        function endOfTurn(moved) {
            // Check if we made our move
            if (moved) {
                reDrawTiles();
                addRandom();
            }
        }

        function shiftLeft() {
            let moved = false;
            for (let i = 1; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[j][i].value != 0) {
                        let c = i;
                        while (c > 0 && board[j][c - 1].value == 0) {
                            moved = true;
                            board[j][c - 1].value = board[j][c].value;
                            board[j][c].value = 0;
                            c--;
                        }
                        if (c > 0) {
                            // Check if tile values are the same
                            if (board[j][c - 1].value == board[j][c].value) {
                                moved = true;
                                board[j][c - 1].value += board[j][c].value;
                                board[j][c].value = 0;
                                board[j][c - 1].merged = true;
                            }
                        }
                    }
                }
            }
            endOfTurn(moved);
        }

        function shiftUp() {
            let moved = false;
            for (let i = 1; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j].value != 0) {
                        let r = i;
                        while (r > 0 && board[r - 1][j].value == 0) {
                            moved = true;
                            board[r - 1][j].value = board[r][j].value;
                            board[r][j].value = 0;
                            r--;
                        }
                        if (r > 0) {
                            // Check if tile values are the same
                            if (board[r - 1][j].value == board[r][j].value) {
                                moved = true;
                                board[r - 1][j].value += board[r][j].value;
                                board[r][j].value = 0;
                                board[r - 1][j].merged = true;
                            }
                        }
                    }
                }
            }
            endOfTurn(moved);
        }

        function shiftRight() {
            let moved = false;
            for (let i = board.length - 2; i >= 0; i--) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[j][i].value != 0) {
                        let c = i;
                        while (c < board.length - 1 && board[j][c + 1].value == 0) {
                            moved = true;
                            board[j][c + 1].value = board[j][c].value;
                            board[j][c].value = 0;
                            c++;
                        }
                        if (c < board.length - 1) {
                            // Check if tile values are the same
                            if (board[j][c + 1].value == board[j][c].value) {
                                moved = true;
                                board[j][c + 1].value += board[j][c].value;
                                board[j][c].value = 0;
                                board[j][c + 1].merged = true;
                            }
                        }
                    }
                }
            }
            endOfTurn(moved);
        }

        function shiftDown() {
            let moved = false;
            for (let i = board.length - 2; i >= 0; i--) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j].value != 0) {
                        let r = i;
                        while (r < board.length - 1 && board[r + 1][j].value == 0) {
                            moved = true;
                            board[r + 1][j].value = board[r][j].value;
                            board[r][j].value = 0;
                            r++;
                        }
                        if (r < board.length - 1) {
                            // Check if tile values are the same
                            if (board[r + 1][j].value == board[r][j].value) {
                                moved = true;
                                board[r + 1][j].value += board[r][j].value;
                                board[r][j].value = 0;
                                board[r + 1][j].merged = true;
                            }
                        }
                    }
                }
            }
            endOfTurn(moved);
        }

        $(function() {
            createGrid();
            init();
            $(this).keydown(function(e) {
                switch (e.key) {
                    case "ArrowLeft":
                        e.preventDefault();
                        shiftLeft();
                        break;
                    case "ArrowUp":
                        e.preventDefault();
                        shiftUp();
                        break;
                    case "ArrowRight":
                        e.preventDefault();
                        shiftRight();
                        break;
                    case "ArrowDown":
                        e.preventDefault();
                        shiftDown();
                        break;
                }
            });
        });
    </script>
</body>

</html>
`
}

export default files;
