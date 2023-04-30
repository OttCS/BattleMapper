const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0xffffff, antialias: true });

let inDiag = 23;
let pxDiag = Math.hypot(app.view.width, app.view.height);

const unit = app.view.width / inDiag / app.view.width * pxDiag;
let scale = { x: unit / 300, y: unit / 300 };

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

let ground = new PIXI.TilingSprite(PIXI.Texture.from("backdrop/parchment.png"));
ground.width = app.view.width;
ground.height = app.view.height;
backdrop.addChild(ground);

let ui = new PIXI.Container();
ui.width = app.view.width;
ui.height = app.view.height;

let grid = new PIXI.Graphics();
grid.lineStyle(2, 0x0, 1);
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
        if (window.location.href.includes("github")) src = 'https://raw.githubusercontent.com/OttCS/BattleMapper/main/' + src;
        let opt = document.createElement("option");
        opt.value = src;
        opt.innerText = src.replace(/(.*\/|\..*)/gi, "");
        if (opt.value != "") {
            opt.onclick = function () {
                tex[src] = PIXI.Texture.from(src);
                console.log("Cached " + src);
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
    "players/arnoul.png",
    "players/bea.png",
    "players/oreo.png",
    "players/shiki.png",
    "players/yagi.png",
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
    'environment/forest/Bush, 1.png',
    'environment/forest/Flower 6 - Green 3.png',
    'environment/forest/Mossy Clump 3 - Green 1.png',
    'environment/forest/Thorns 1.png',
    'environment/forest/Bush 1 - Red.png',
    'environment/forest/Flower 7 - Green 3.png',
    'environment/forest/Mossy Clump 4 - Green 1.png',
    'environment/forest/Thorns 2.png',
    'environment/forest/Bush 2 - Green 1.png',
    'environment/forest/Flowers 1.png',
    'environment/forest/Mossy Clump 5 - Green 1.png',
    'environment/forest/Thorns 3.png',
    'environment/forest/Bush, 2.png',
    'environment/forest/Flowers 2.png',
    'environment/forest/Mossy Clump 6 - Green 1.png',
    'environment/forest/Thorns 4.png',
    'environment/forest/Bush 3 - Green 3.png',
    'environment/forest/Flowers 3.png',
    'environment/forest/Mushrooms, 1.png',
    'environment/forest/Thorns 5.png',
    'environment/forest/Bush 4 - Green 2.png',
    'environment/forest/Flowers 4.png',
    'environment/forest/Mushrooms, 2.png',
    'environment/forest/Tree, 1.png',
    'environment/forest/Bush 5 - Green 1.png',
    'environment/forest/Flowers 5.png',
    'environment/forest/Mushrooms, 3.png',
    'environment/forest/Tree, 2.png',
    'environment/forest/Bush 6 - Green 3.png',
    'environment/forest/Flowers 6.png',
    'environment/forest/Puddle, 1.png',
    'environment/forest/Tree, 3.png',
    'environment/forest/Bush 7 - Green 1.png',
    'environment/forest/Foliage 10 - Green 1.png',
    'environment/forest/Puddle, 2.png',
    'environment/forest/Tree, fallen.png',
    'environment/forest/Bush 8 - Green 1.png',
    'environment/forest/Foliage 11 - Green 1.png',
    'environment/forest/Puddle, 3.png',
    'environment/forest/Tree Stump 10 - Cut.png',
    'environment/forest/Bush 9 - Yellow.png',
    'environment/forest/Foliage 12 - Green 1.png',
    'environment/forest/Rocks, 1.png',
    'environment/forest/Tree Stump 10 - Tree.png',
    'environment/forest/Bush, long, 1.png',
    'environment/forest/Foliage 13 - Green 1.png',
    'environment/forest/Rocks, 2.png',
    'environment/forest/Tree Stump 1 - Cut.png',
    'environment/forest/Bush, long, 2.png',
    'environment/forest/Foliage 1 - Green 1.png',
    'environment/forest/Rocks, 3.png',
    'environment/forest/Tree Stump 1 - Tree.png',
    'environment/forest/Cliff 1.png',
    'environment/forest/Foliage 2 - Green 1.png',
    'environment/forest/Rocks, 4.png',
    'environment/forest/Tree Stump 2 - Cut.png',
    'environment/forest/Cliff 2.png',
    'environment/forest/Foliage 3 - Green 1.png',
    'environment/forest/Rocks, 5.png',
    'environment/forest/Tree Stump 2 - Tree.png',
    'environment/forest/Cliff 3.png',
    'environment/forest/Foliage 4 - Green 1.png',
    'environment/forest/Rocks, 6.png',
    'environment/forest/Tree Stump 3 - Cut.png',
    'environment/forest/Clovers, 1.png',
    'environment/forest/Foliage 5 - Green 1.png',
    'environment/forest/Rocks, 7.png',
    'environment/forest/Tree Stump 3 - Tree.png',
    'environment/forest/Clovers, 2.png',
    'environment/forest/Foliage 6 - Green 1.png',
    'environment/forest/Rocks, 8.png',
    'environment/forest/Tree Stump 4 - Cut.png',
    'environment/forest/Dirt patch.png',
    'environment/forest/Foliage 7 - Green 1.png',
    'environment/forest/Rocky slope, ridge.png',
    'environment/forest/Tree Stump 4 - Tree.png',
    'environment/forest/Duff, large.png',
    'environment/forest/Foliage 8 - Green 1.png',
    'environment/forest/Soil Patch 1.png',
    'environment/forest/Tree Stump 5 - Cut.png',
    'environment/forest/Duff, medium.png',
    'environment/forest/Foliage 9 - Green 1.png',
    'environment/forest/Soil Patch 2.png',
    'environment/forest/Tree Stump 5 - Tree.png',
    'environment/forest/Duff, small.png',
    'environment/forest/Grassy slope.png',
    'environment/forest/Soil Patch 3.png',
    'environment/forest/Tree Stump 6 - Cut.png',
    'environment/forest/Fallen Tree 1.png',
    'environment/forest/Ivy 1 - Green 3.png',
    'environment/forest/Soil Patch 4.png',
    'environment/forest/Tree Stump 6 - Tree.png',
    'environment/forest/Fallen Tree 2.png',
    'environment/forest/Ivy 2 - Green 3.png',
    'environment/forest/Soil Patch 5.png',
    'environment/forest/Tree Stump 7 - Cut.png',
    'environment/forest/Fallen Tree - Mossy - Green 1.png',
    'environment/forest/Leaf litter, leaves, 1.png',
    'environment/forest/Soil Patch 6.png',
    'environment/forest/Tree Stump 7 - Tree.png',
    'environment/forest/Fern 1 - Green 3.png',
    'environment/forest/Leaf litter, leaves, 2.png',
    'environment/forest/Stone 1.png',
    'environment/forest/Tree Stump 8 - Cut.png',
    'environment/forest/Fern 2 - Green 3.png',
    'environment/forest/Leaf litter, leaves, 3.png',
    'environment/forest/Stone 2.png',
    'environment/forest/Tree Stump 8 - Tree.png',
    'environment/forest/Fern 3 - Green 1.png',
    'environment/forest/Mossy Boulder 1 - Green 1.png',
    'environment/forest/Stone 3.png',
    'environment/forest/Tree Stump 9 - Cut.png',
    'environment/forest/Fern 4 - Green 1.png',
    'environment/forest/Mossy Boulder 2 - Green 1.png',
    'environment/forest/Stump, 1.png',
    'environment/forest/Tree Stump 9 - Tree.png',
    'environment/forest/Fern 5 - Green 3.png',
    'environment/forest/Mossy Boulder 3 - Green 1.png',
    'environment/forest/Stump, 2.png',
    'environment/forest/Vine, creeper, 1.png',
    'environment/forest/Fern 6 - Green 3.png',
    'environment/forest/Mossy Boulder 4 - Green 1.png',
    'environment/forest/Stump, 3.png',
    'environment/forest/Vine, creeper, 2.png',
    'environment/forest/Fern 7 - Green 3.png',
    'environment/forest/Mossy Boulder 5 - Green 1.png',
    'environment/forest/Stump, big.png',
    'environment/forest/Vine, creeper, 3.png',
    'environment/forest/Flower 1.png',
    'environment/forest/Mossy Boulder 6 - Green 1.png',
    'environment/forest/Thicket, long.png',
    'environment/forest/Water Puddles 1 - Green 1.png',
    'environment/forest/Flower 2.png',
    'environment/forest/Mossy Boulder 7 - Green 1.png',
    'environment/forest/Thicket.png',
    'environment/forest/Water Puddles 2.png',
    'environment/forest/Flower 3.png',
    'environment/forest/Mossy Boulder 8 - Green 1.png',
    'environment/forest/Thick Foliage 1 - Green 2.png',
    'environment/forest/Water Puddles 3.png',
    'environment/forest/Flower 4.png',
    'environment/forest/Mossy Clump 1 - Green 1.png',
    'environment/forest/Thick Foliage 2 - Green 2.png',
    'environment/forest/Water Puddles 4.png',
    'environment/forest/Flower 5 - Green 3.png',
    'environment/forest/Mossy Clump 2 - Green 1.png',
    'environment/forest/Thick Foliage 3 - Green 2.png'
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
                if (PIXI.collision.rectangle(PIXI.Mouse, token)) {
                    holding = token;
                    ghost.x = token.x;
                    ghost.y = token.y;
                    ghost.texture = holding.texture;
                    ghost.width = holding.width;
                    ghost.height = holding.height;
                }
            });
        } else if (PIXI.Mouse.fired('Secondary')) {
            target = null;
            tokens.forEach(token => {
                if (PIXI.collision.rectangle(PIXI.Mouse, token))
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
                if (PIXI.collision.rectangle(PIXI.Mouse, token))
                    target = token;
            });
            if (target) {
                removeToken();
            } else {
                target = new PIXI.Sprite(last.tex);
                target.rotation = last.rotate;
                target.x = ((PIXI.Mouse.x / unit) ^ 0) * unit + unit * 0.5;
                target.y = ((PIXI.Mouse.y / unit) ^ 0) * unit + unit * 0.5;
                target.anchor = { x: 0.5, y: 0.5 };
                target.scale = scale;
                tokens.add(target);
                tokenHold.addChild(target);
            }
            saveToLocal();
        }
    }
});

function saveToLocal() {
    console.log("Scene saved");
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
    let ls = localStorage.getItem("quicksave");
    let src = JSON.parse(ls ? ls : []);
    src.forEach(token => {
        let tk = PIXI.Sprite.from(token.src);
        tk.x = token.x * unit + unit * 0.5;
        tk.y = token.y * unit + unit * 0.5;
        tk.anchor = { x: 0.5, y: 0.5 };
        tk.scale
        tk.scale = scale;
        tk.rotation = token.rotate;
        tokens.add(tk);
        tokenHold.addChild(tk);
    });
    saveToLocal();
}

loadLocal();
app.stage.addChild(ui);