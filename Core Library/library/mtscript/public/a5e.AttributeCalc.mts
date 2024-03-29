[h,if(argCount() == 0),CODE:{
	[h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
};{
	[h:ParentToken = arg(0)]
	[h:a5e.UnifiedAbilities = arg(1)]
}]
[h:pm.FinalAtr = ""]
[h:pm.TempMods = ""]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:"<!-- Note: Currently, the 'default' score for an attribute is 10. This should only come into play if attributes are added to the campaign after character creation, but if you would like to change the default it should be done here. A default must be set, or else errors will occur. -->"]
[h:pm.TempAllBonus = json.path.read(a5e.UnifiedAbilities ,"\$[*]['Attributes'][?(@.All!=null)]['All']","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(json.isEmpty(pm.TempAllBonus)): pm.AllBonus = 0; pm.AllBonus = math.arraySum(pm.TempAllBonus)]
[h:BaseAttributes = getProperty("a5e.stat.BaseAttributes")]
[h,foreach(TempAttribute,pm.GetAttributes("Name","json")),CODE:{
	[h,if(json.get(BaseAttributes,TempAttribute)==""): pm.baseAtr = 10; pm.baseAtr = json.get(BaseAttributes,TempAttribute)]
	[h:pm.TempAtrBonus = json.path.read(a5e.UnifiedAbilities ,"\$[*]['Attributes'][?(@."+TempAttribute+"!=null)]['"+TempAttribute+"']","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(json.isEmpty(pm.TempAtrBonus)):
		pm.AtrBonus = pm.AllBonus;
		pm.AtrBonus = math.arraySum(pm.TempAtrBonus)+pm.AllBonus
	]
	[h:pm.Atr = pm.baseAtr + pm.AtrBonus]
	[h:pm.TempMods = json.set(pm.TempMods,TempAttribute,floor((pm.Atr-10)/2))]
	[h:pm.FinalAtr = json.set(pm.FinalAtr,TempAttribute,pm.baseAtr + pm.AtrBonus)]
}]

[h:pm.PassiveFunction("AbilityScore")]
[h:macro.return = json.set("","Modifiers",pm.TempMods,"Attributes",pm.FinalAtr)]