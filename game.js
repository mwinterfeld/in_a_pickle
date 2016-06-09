function Card(x, y, stage){
    this.rect = new createjs.Shape(new createjs.Graphics().f("#eeeeee").s("rbga(20,20,20,1)").rr(x, y, Card.width, Card.height, 3));
    this.text = new createjs.Text(Card.available[Math.floor((Math.random() * Card.available.length))], "20px Serif", "#212121"); 
    this.text.x = x + Card.width / 2 - this.text.getBounds().width / 2;
    this.text.y = y + Card.height / 3;
    stage.addChild(this.rect);
    stage.addChild(this.text);
}

Card.width = 150;
Card.height = 200;

Card.available = [
    "Boat", "Dog", "Pickle", "Foot", "Needle", "Washington", "France", "Pizza", "Water",
    "Kitten", "Dirt", "Hill", "Sky", "Train", "Light", "Poster", "Paper", "Pyramid", "Ice",
    "Volcano", "Canary", "House", "Spaghetti", "Ocean", "Banana", "Monarch", "Spindle",
    "Phone", "Clock", "Jacuzzi", "Hair", "Lamp", "Caterpillar", "Avocado", "Stick",
    "Meringue", "Finger", "Bottle", "Granite", "Dust", "Smoke", "Fan", "Air", "Baby",
    "Windwill", "Hacksaw", "Box", "Washing\nMachine", "Island", "Spatula", "Bowl", "Canada",
    "Turkey", "Painting", "Room", "Snowman", "Cup", "Tea", "Ballsack", "Sake", "Kitty",
    "Rope", "Table", "Cell", "Tomato", "Italian", "Doorbell", "Dinosaur", "Planet", "Rock",
    "Amoeba", "Jelly", "Beans", "Fart", "Cake", "Auditorium", "Penis", "Whale", "Forest",
    "Island", "Strip Club", "Gabriel\nIglesias", "San Francisco", "Peter\nDinklage",
    "Key", "Television", "Garbage", "Hurricane", "Sharknado", "Cockroach", "Bedbug",
    "Bed", "Pillow", "Fire", "Campfire", "Log", "Mansion", "Celebrity", "Iceberg", "Ferret",
    "Fairy", "Magic", "Totoro", "The\nTerminator", "Arnold\nSchwarzenegger", "Book", "Idea",
    "Blood", "Chromosome", "Heart", "Liver", "Toe", "Nail", "Cloud", "Space", "Black Hole",
    "Spaceship", "USS\nEnterprise", "Nebula", "Asteroid", "Desktop", "Liquid", "Phone",
    "Paint", "Can", "Pot", "Powder", "Snowflake", "Rain", "Mountain", "River", "Mitten",
    "Couch", "Water Bear", "Canyon", "The\nInternet", "Your Momma", "Your Papa", "Beetle",
    "Greatness", "Shower", "Shower Caddy", "Lots Of\nBreasts", "Raw Meat", "Bullet", "Titan",
    "The Death\nStar", "Electron", "Quark", "Quantum\nField", "Leaves", "Number", "Wrench",
    "Word", "Alphabet", "Infinity", "Lingerie", "Shade"
];

Card.inplay = [];

function runGame(){
    var CANVAS_WIDTH = $(document).innerWidth() * 0.9;
    var CANVAS_HEIGHT = $(document).innerHeight() * 0.9;
    $("#canvas").attr("height", CANVAS_HEIGHT);
    $("#canvas").attr("width", CANVAS_WIDTH);
    var stage = new createjs.Stage("canvas");
    var c1 = new Card(50, 50, stage);
    var c2 = new Card(160, 60, stage);
    var c3 = new Card(270, 70, stage);
    var c4 = new Card(380, 80, stage);
    stage.update();
}

runGame();