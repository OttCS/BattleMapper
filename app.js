PIXI.Zephyr.useMouse();

const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0xffffff, antialias: true });

let inDiag = 23;
let pxDiag = Math.hypot(app.view.width, app.view.height);

const unit = app.view.width / inDiag / app.view.width * pxDiag;

app.view.id = "DISPLAY";
document.body.appendChild(app.view);
PIXI.Mouse.setContainer(app.view);

let tex = {
    token: PIXI.Texture.from("assets/token.png"),
};

let backdrop = new PIXI.Container();
backdrop.width = app.view.width;
backdrop.height = app.view.height;
app.stage.addChild(backdrop);

let ground = new PIXI.TilingSprite(PIXI.Texture.from("backdrop/flagstone.png"));
ground.width = app.view.width;
ground.height = app.view.height;
backdrop.addChild(ground);

let ui = new PIXI.Container();
ui.width = app.view.width;
ui.height = app.view.height;

let grid = new PIXI.Graphics();
grid.lineStyle(2, 0xffffff, 1);
let cStyle = {
    fontSize: unit / 5,
    fill: 0x801020,
    fontWeight: 'bold',
}
for (let y = 0; y <= app.view.height; y += unit) {
    let cTxt = new PIXI.Text(String.fromCharCode((y / unit) + 65), cStyle);
    cTxt.x = 4;
    cTxt.y = y + 4;
    ui.addChild(cTxt);
    for (let x = 0; x <= app.view.width; x += unit) {
        grid.drawRect(x, y, unit, unit);
        if (x > 0 && y == 0) {
            let cTxt = new PIXI.Text(x / unit + 1, cStyle);
            cTxt.x = x + 4;
            cTxt.y = y + 4;
            ui.addChild(cTxt);
        }
    }
}
ui.addChild(grid);

let ghost = new PIXI.Sprite(tex.token);
ghost.width = ghost.height = unit;
ghost.anchor = { x: 0.5, y: 0.5 };
ghost.alpha = 0.7;
ui.addChild(ghost);

let tokenHold = new PIXI.Container();
app.stage.addChild(tokenHold);

let tokens = new Set();

let holding = null;
let target = null;


let last = {
    tex: tex.token,
    rotate: 0
}

const PANEL = document.querySelector("#panel");

function hidePanel() {
    PANEL.style.display = "none";
}

function showPanel() {
    PANEL.style.display = "block";
    document.querySelectorAll("select").forEach(select => { select.selectedIndex = "0" });
}

function removeToken() {
    tokens.delete(target);
    tokenHold.removeChild(target);
    target = null;
    hidePanel();
    saveToLocal();
}

function rotateToken() {
    target.rotation += Math.PI * 0.5;
    last.rotate = target.rotation;
    saveToLocal();
}

function createOptions(dest, srcArr) {
    let opt = document.createElement("option");
    opt.innerText = dest.id.replace("-", " ");
    dest.appendChild(opt);
    srcArr.forEach((src) => {
        let opt = document.createElement("option");
        opt.value = src;
        opt.innerText = src.replace(/(.*\/|\..*)/gi, "");
        tex[src] = PIXI.Texture.from(src);
        if (opt.value != "") {
            opt.onclick = function () {
                target.texture = tex[src];
                last.tex = tex[src];
                last.rotate = 0;
                target.rotation = 0;
                hidePanel();
                saveToLocal();
            }
        }
        dest.appendChild(opt);
    })
}

createOptions(document.querySelector("#PLAYERS"), [
    "players/Arnoul.png",
    "players/Bea.png",
    "players/Oreo.png",
    "players/Shiki.png",
    "players/Yagi.png",
]);

createOptions(document.querySelector("#NPCS"), [
    "npcs/Roza.png",
    "npcs/rogue.png",
    "npcs/rogue-red.png",
    "npcs/rogue-green.png",
    "npcs/rogue-black.png",
]);

createOptions(document.querySelector("#MONSTERS"), [
    "monsters/Nothic.png",
    "monsters/Skum.png",
]);

createOptions(document.querySelector("#FOREST"), [
    "environment/forest/Bush 1 - Red.png",
    "environment/forest/Bush 2 - Green 1.png",
    "environment/forest/Bush 3 - Green 3.png",
    "environment/forest/Bush 4 - Green 2.png",
    "environment/forest/Tree Stump 1 - Cut.png",
    "environment/forest/Tree Stump 2 - Cut.png",
    "environment/forest/Tree Stump 3 - Cut.png",
    "environment/forest/Tree Stump 4 - Cut.png",
    "environment/forest/Tree Stump 7 - Cut.png",
    "environment/forest/Water Puddles 2.png",
]);

createOptions(document.querySelector("#FURNITURE"), [
    "environment/furniture/Barrels, stacked, pile.png",
    "environment/furniture/Light - Brazier 3.c.png",
    "environment/furniture/Chair - Armchair 1.a.png",
    "environment/furniture/Chair - Simple - Broken 1 - Dark.png",
    "environment/furniture/Chest - Lockbox 2 - Wood.png",
    "environment/furniture/Clutter - Book pile 1.a.png",
    "environment/furniture/Clutter - Book pile 5.a.png",
    "environment/furniture/Crate, box, large.png",
    "environment/furniture/Feature - Globe.png",
    "environment/furniture/Feature - Statue 1 - Stone.png",
    "environment/furniture/Feature - Statue 2 - Stone.png",
    "environment/furniture/Feature - Statue 3 - Stone.png",
    "environment/furniture/Table, large, round, rickety.png",
    "environment/furniture/Table, large, square, rickety.png",
    "environment/furniture/Rug 6.b.png",
    "environment/furniture/Storage - Crate 8 - Dark.png",
]);

createOptions(document.querySelector("#ROOFTOP"), [
    "environment/rooftop/Blue Roof.png",
    "environment/rooftop/Blue Roof - Shadow.png",
    "environment/rooftop/Red Roof.png",
    "environment/rooftop/Red Roof - Shadow.png",
    "environment/rooftop/Gray Roof.png",
    "environment/rooftop/Gray Roof - Shadow.png",
]);

app.ticker.add((deltaTime) => {
    if (holding != null) {
        ghost.visible = true;
        holding.x = ((PIXI.Mouse.x / unit) ^ 0) * unit + unit * 0.5;
        holding.y = ((PIXI.Mouse.y / unit) ^ 0) * unit + unit * 0.5;
        if (!PIXI.Mouse.down('Primary')) {
            holding = null;
            saveToLocal();
        };
    } else {
        ghost.visible = false;
        if (PIXI.Mouse.fired('Primary')) {
            holding = null;
            tokens.forEach(token => {
                if (PIXI.collision.aabb(PIXI.Mouse, token)) {
                    holding = token;
                    ghost.x = token.x;
                    ghost.y = token.y;
                    ghost.texture = holding.texture;
                }
            });
        } else if (PIXI.Mouse.fired('Secondary')) {
            target = null;
            tokens.forEach(token => {
                if (PIXI.collision.aabb(PIXI.Mouse, token))
                    target = token;
            });
            if (target == null) {
                if (PANEL.style.display == "none") {
                    showPanel();
                } else {
                    hidePanel();
                }
            } else {
                showPanel();
            }
        } else if (PIXI.Mouse.fired('Middle')) {
            target = null;
            tokens.forEach(token => {
                if (PIXI.collision.aabb(PIXI.Mouse, token))
                    target = token;
            });
            if (target) {
                removeToken();
            } else {
                target = new PIXI.Sprite(last.tex);
                target.rotation = last.rotate;
                target.x = ((PIXI.Mouse.x / unit) ^ 0) * unit + unit * 0.5;
                target.y = ((PIXI.Mouse.y / unit) ^ 0) * unit + unit * 0.5;
                target.width = target.height = unit;
                target.anchor = { x: 0.5, y: 0.5 };
                tokens.add(target);
                tokenHold.addChild(target);
            }
            saveToLocal();
        }
    }
});

function saveToLocal() {
    let res = [];
    tokens.forEach(token => {
        res.push({
            x: (token.x / unit) ^ 0,
            y: (token.y / unit) ^ 0,
            src: token._texture.baseTexture.cacheId
        });
    });
    localStorage.setItem("quicksave", JSON.stringify(res));
}

function saveToLocal() {
    let res = [];
    tokens.forEach(token => {
        res.push({
            x: (token.x / unit) ^ 0,
            y: (token.y / unit) ^ 0,
            src: token._texture.baseTexture.cacheId,
            rotate: token.rotation
        });
    });
    localStorage.setItem("quicksave", JSON.stringify(res));
}

function clearScene() {
    tokens = new Set();
    tokenHold.children = [];
}

function loadLocal() {
    clearScene();
    let src = JSON.parse(localStorage.getItem("quicksave"));
    src.forEach(token => {
        let tk = PIXI.Sprite.from(token.src);
        tk.x = token.x * unit + unit * 0.5;
        tk.y = token.y * unit + unit * 0.5;
        tk.anchor = { x: 0.5, y: 0.5 };
        tk.width = tk.height = unit;
        tk.rotation = token.rotate;
        tokens.add(tk);
        tokenHold.addChild(tk);
    });
}

loadLocal();
app.stage.addChild(ui);