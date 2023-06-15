[h:SaveInputData = macro.args]
[h:SaveInputData = pm.a5e.KeyStringsToNumbers(SaveInputData)]
[h:ParentToken = json.get(SaveInputData,"ParentToken")]
[h:Flavor = json.get(SaveInputData,"Flavor")]
[h:switchToken(ParentToken)]

[h:EffectIDChoice = json.get(SaveInputData,"EffectIDChoice")]
[h,if(EffectIDChoice == ""),CODE:{
	[h:OutputOptions = json.get(SaveInputData,"OutputOptions")]
	[h:SaveChoice = json.get(SaveInputData,"SaveChoice")]
	[h:SituationalBonus = json.get(SaveInputData,"SituationalBonus")]
	[h:AdvantageChoice = json.get(SaveInputData,"AdvantageChoice")]
	[h:SaveDescription = json.get(SaveInputData,"SaveDescription")]

	[h,switch(OutputOptions),CODE:
		case 0:{[h:outputTargets = "not-gm"][h:linkPermissions = "gm-self"]};
		case 1:{[h:outputTargets = "self"][h:linkPermissions = "gm-self"]};
		case 2:{[h:outputTargets = "none"][h:linkPermissions = "gm"]}
	]

	[h:ClassFeatureData = json.set("",
		"Flavor",if(SaveDescription=="",Flavor,SaveDescription),
		"ParentToken",ParentToken,
		"DMOnly",if(outputTargets=="none",1,0),
		"Class","zzChecksAndSaves",
		"Name","Saving Throw",
		"FalseName","",
		"OnlyRules",0
	)]

	[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
	[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
	[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]
	
	[h:SaveData = json.set("",
		"Save",SaveChoice,
		"Type","Save",
		"ParentToken",ParentToken,
		"Bonus",SituationalBonus,
		"Advantage",or(AdvantageChoice==3,AdvantageChoice==4),
		"Disadvantage",or(AdvantageChoice==0,AdvantageChoice==1),
		"ForcedAdvantage",or(AdvantageChoice==0,AdvantageChoice==4),
		"PCOutput",outputTargets
	)]
	
	[h,MACRO("Save@Lib:pm.a5e.Core"): SaveData]
	[h:SaveData = macro.return]
	[h:abilityTable = json.get(SaveData,"Table")]
	
	[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
	
	[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
	[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
	[h:broadcastAsToken(output.GM,"gm")]
	[h:broadcastAsToken(output.PC,outputTargets)]
};{
	[h:EffectToResolve = json.get(json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID =='"+EffectIDChoice+"')]"),0)]

	[h,MACRO("ResolveEffectsBorder@Lib:pm.a5e.Core"): json.set(EffectToResolve,"SpecificTargets",ParentToken)]

	[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]
}]

[h:closeDialog("SaveInput")]