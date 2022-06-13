[h:GrappleData = macro.args]
[h:Flavor=json.get(GrappleData,"Flavor")]
[h:ParentToken=json.get(GrappleData,"ParentToken")]
[h:outputTargets = if(PC.Ally.Enemy == 2,"none","not-gm")]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(GrappleData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(GrappleData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(GrappleData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(GrappleData,"AccentTextOverride"),
	"TitleFont",json.get(GrappleData,"TitleFont"),
	"BodyFont",json.get(GrappleData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name","Grapple",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h,MACRO("Grapple@Lib:pm.a5e.Core"):GrappleData]
[h:ReturnData = macro.return]
[h:abilityTable = json.get(ReturnData,"Table")]
[h:abilityEffect = json.get(ReturnData,"Effect")]

[h,foreach(effect,abilityEffect),CODE:{
    [h:effectID = 1d10000000000000 + json.get(getInfo("client"),"timeInMs")]
    [h:priorEffectIDs = json.path.read(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*]['ID']")]
    [h,while(json.contains(priorEffectIDs,effectID)): effectID = 1d10000000000000 + json.get(getInfo("client"),"timeInMs")]
    [h:setLibProperty("gd.Effects",json.append(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),json.set(effect,"ID",effectID,"ParentToken",ParentToken)),"Lib:pm.a5e.Core")]
}]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]