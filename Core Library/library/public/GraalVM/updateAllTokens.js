function updateAllTokens(){
	let allMaps = JSON.parse(MTScript.execMacro("getAllMapNames('json')"));
	for(let map of allMaps){
		let thisMapTokens = MapTool.tokens.getMapTokens(map);
		for(let token of thisMapTokens){
			currentMaxHitDice = JSON.parse(token.getProperty("a5e.stat.MaxHitDice"));
			currentHitDice = JSON.parse(token.getProperty("a5e.stat.HitDice"));
			for(let size of Object.keys(currentMaxHitDice)){
				if(size.substring(0,1) === "1"){
					currentMaxHitDice[size.substring(1)] === currentMaxHitDice[size];
					delete currentMaxHitDice[size];

					currentHitDice[size.substring(1)] === currentHitDice[size];
					delete currentHitDice[size];
				}
			}

			token.setProperty("a5e.stat.MaxHitDice",JSON.stringify(currentMaxHitDice));
			token.setProperty("a5e.stat.HitDice",JSON.stringify(currentHitDice));
		}
	}
}