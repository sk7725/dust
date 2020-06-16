const HugeSolarPanel = extendContent(SolarGenerator, "huge-solar-panel", {
	draw(tile){
		Draw.rect(Core.atlas.find(this.name + "-bottom"), tile.drawx(), tile.drawy());
		Draw.rect(Core.atlas.find(this.name + "-spinner-0"), tile.drawx() - 7, tile.drawy() + 7, Time.time() + 20);
		Draw.rect(Core.atlas.find(this.name + "-spinner-1"), tile.drawx() + 7, tile.drawy() + 7, Time.time() + 20);
		Draw.rect(Core.atlas.find(this.name + "-spinner-2"), tile.drawx() - 7, tile.drawy() - 7, Time.time() + 20);
		Draw.rect(Core.atlas.find(this.name + "-spinner-3"), tile.drawx() + 7, tile.drawy() - 7, Time.time() + 20);
		Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy());
	},
	generateIcons: function(){
		return [
			Core.atlas.find(this.name),
		];
	},
});