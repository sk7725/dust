
if(typeof(PixmapTextureData1) == "undefined"){
  const PixmapTextureData1 = Packages.arc.graphics.gl.PixmapTextureData;
}

const tolerance = 0.01;

const res={};

res.masks = {};
res.Item = {
	setTexture(pixmap) {
		this.pixmap = pixmap;
		const texture = new Texture(new PixmapTextureData1(pixmap, null, true, false, true));
		const item = this;
		Core.app.post(run(() => {
			item.region = Core.atlas.addRegion(this.name, new TextureRegion(texture))
		}));
	},
	getTexture() {
		return this.pixmap;
	},
	load(){
		// Colorize the mask with this.color.
		const color = this.color;
		var mask = res.masks[this.mask];
		if(mask === undefined){ // Cache mask textures to save cpu
			mask = Core.atlas.getPixmap(this.mask);
			res.masks[this.mask] = mask;
		}

		// Actually colour the mask, pixel by pixel
		var newTexture = new Pixmap(32, 32);
		var pixel = new Color(), x, y;
		for(x = 0; x < 32; x++){
			for(y = 0; y < 32; y++){
				pixel.set(mask.getPixel(x, y));
				if(pixel.a > 0){
          if(x%4==0||y%4==0){
  					pixel.a = 0; // For ghost items :o
          }
					newTexture.draw(x, y, pixel);
				}
			}
		}

		if (this.layers) {
			var layers = [];
			for (var i in this.layers) {
				layers[i] = Core.atlas.getPixmap(this.layers[i]);
			}

			var lPix = new Color();
			for (x = 0; x < 32; x++) {
				for (y = 0; y < 32; y++) {
					pixel.set(newTexture.getPixel(x, y));
					for (i in layers) {
						if (pixel.a < 1) {
							lPix.set(layers[i].getPixel(x, y));
							pixel.add(lPix);
							pixel.a += lPix.a;
						}
					}
					newTexture.draw(x, y, pixel);
				}
			}
		}
		// Store it as the items icon
		this.setTexture(newTexture);
	},

	icon(icon){
		return this.region;
	}
};
res.Item.type = ItemType.material;

function addItemForm(pitem, type){
  if(Vars.content.getByName(ContentType.item, pitem.name+"-dust")){
    return;
  }
  try{
    var itemDef = Object.create(res.Item);

    if(!type) type = "resource";
    type = ItemType[type];

    itemDef.type = type;
    itemDef.mask = pitem.name;

    var item = extendContent(Item, pitem.name+"-dust");
    item.color = pitem.color.cpy();
  	item.type = itemDef.type;

    item.localizedName = "["+pitem.color.toString()+"]" + pitem.localizedName +" "+ Core.bundle.get("itemform.dustmod.name") + "[]";
    item.explosiveness = pitem.explosiveness*0.25;
    item.flammability = pitem.flammability*0.25;
    item.radioactivity = pitem.radioactivity*0.25;
    item.hardness = pitem.hardness;
    item.description = "["+pitem.color.toString()+"]" + Core.bundle.format("itemform.dustmod.description", pitem.localizedName) + "[]";
    item.load();
    print("Add item:"+item.name);
  }
  catch(err){
    print(err);
  }
}

function addItemForms(i){
  if(!it.name.includes("-dust")){
    addItemForm(it, "material");
  }
}

function addItemRoot(){
  Vars.content.items().each(cons(it=>{
    addItemForms(i);
  }));
}

Events.on(EventType.ContentReloadEvent, run(() => {
  print("Init ContentReload!");
  addItemRoot();
}));

Events.on(EventType.ClientLoadEvent, run(() => {
  print("Init Load!");
  addItemRoot();
}));
