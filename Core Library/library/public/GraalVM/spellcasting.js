function spellcasting(allSpellData){
	let SpellData = allSpellData.SpellData;
	let nonSpellData = delete allSpellData.SpellData;
	let ParentToken = MapTool.tokens.getTokenByID(nonSpellData.ParentToken);

	let isTooltip = false;
	let needsSplitGMOutput;
	if(ParentToken.getProperty("a5e.stat.Allegiance") === "Enemy"){
		needsSplitGMOutput = true;
	}
	else{
		needsSplitGMOutput = nonSpellData.needsSplitGMOutput;
	}

	let unifiedFeatures = gatherFeatures(ParentToken);

	let isCantrip = SpellData.Level === 0;

	let allSpellEffects = SpellData.Effects;
	//TODO: Make this a general function for determining which effect is used
	if(allSpellEffects.length === 1){

	}

	//Get forced selections

	//Get other choices to make (e.g. from features, like if using metamagic)

	//Kick to input, if no input needed go straight to next function
}