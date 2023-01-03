[h,if(argCount()>1),CODE:{
	[h:tempCastingClass = if(json.get(arg(1),"Class")=="","Use_Feature_Data",json.get(arg(1),"Class"))]
};{
	[h:tempCastingClass = "Use_Feature_Data"]
}]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:currentFeatureSpellsAlwaysActive = json.get(pass.FeatureInfo,"SpellsAlwaysActive")]
[h,if(currentFeatureSpellsAlwaysActive == ""): currentFeatureSpellsAlwaysActive = "[]"]
[h:tempSpellsSelected = json.get(pass.FeatureInfo,"SpellsSelected")]
[h,if(tempSpellsSelected == ""),CODE:{
	[h:currentFeatureSpellsSelected = "[]"]
};{
	[h:currentFeatureSpellsSelected = "[]"]
	[h,foreach(spellGroup,tempSpellsSelected): currentFeatureSpellsSelected = json.merge(currentFeatureSpellsSelected,spellGroup)]
}]
[h:isCastingClass = json.contains(json.merge(currentFeatureSpellsAlwaysActive,currentFeatureSpellsSelected),SpellName)]

[h,if(isCastingClass),CODE:{
	[h,if(tempCastingClass=="Use_Feature_Data"):
		ClassOptionsArray = json.append(ClassOptionsArray,pass.FeatureInfo);
		ClassOptionsArray = json.append(ClassOptionsArray,json.set(pass.FeatureInfo,"CastAsClass",tempCastingClass))
	]
};{}]