[h:sp.Data = macro.args]
[h:sLevel = json.get(json.get(sp.Data,0),"ForcedLevel")]

[h,switch(sLevel),code:
		case "Ritual": {[BorderColor="#93160D"][TextColor="#FFFFFF"][eLevel=0]};
		case "1": {[BorderColor="#fd2a19"][TextColor="#FFFFFF"][eLevel=1]};
		case "2": {[BorderColor="#f7ae27"][TextColor="#000000"][eLevel=2]};
		case "3": {[BorderColor="#fcf734"][TextColor="#000000"][eLevel=3]};
		case "4": {[BorderColor="#c3f130"][TextColor="#000000"][eLevel=4]};
		case "5": {[BorderColor="#008c14"][TextColor="#FFFFFF"][eLevel=5]};
		case "6": {[BorderColor="#103ffb"][TextColor="#FFFFFF"][eLevel=6]};
		case "7": {[BorderColor="#052090"][TextColor="#FFFFFF"][eLevel=7]};
		case "8": {[BorderColor="#8e268c"][TextColor="#FFFFFF"][eLevel=8]};
		case "9": {[BorderColor="#f84af4"][TextColor="#FFFFFF"][eLevel=9]};
		case "W": {[BorderColor="#000000"][TextColor="#FFFFFF"][eLevel=WSpellLevel]};
		case "MA": {[BorderColor="#000000"][TextColor="#FFFFFF"][eLevel=sLevel]};
		case "Free": {[BorderColor="02f5f6"][TextColor="#000000"][eLevel=sLevel]}
		]

[h:ClassFeatureData = json.set("",
	"Flavor",json.get(json.get(sp.Data,0),"Flavor"),
	"ParentToken",json.get(json.get(sp.Data,0),"ParentToken"),
	"DMOnly",json.get(json.get(sp.Data,0),"DMOnly"),
	"BorderColorOverride",if(json.get(json.get(sp.Data,0),"BorderColorOverride")=="",BorderColor,json.get(json.get(sp.Data,0),"BorderColorOverride")),
	"TitleFontColorOverride",if(json.get(json.get(sp.Data,0),"TitleFontColorOverride")=="",TextColor,json.get(json.get(sp.Data,0),"TitleFontColorOverride")),
	"AccentBackgroundOverride",json.get(json.get(sp.Data,0),"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(json.get(sp.Data,0),"AccentTextOverride"),
	"TitleFont",json.get(json.get(sp.Data,0),"TitleFont"),
	"BodyFont",json.get(json.get(sp.Data,0),"BodyFont"),
	"Class","zzSpell",
	"Name",json.get(json.get(sp.Data,0),"SpellName")+" - Full Description",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]
[h:abilityTable = ""]

[h:output.GM = output.GM + json.get(json.get(sp.Data,0),"sDescription")+"</div></div>"]
[h:broadcastAsToken(output.GM,if(json.get(json.get(sp.Data,0),"DMOnly"),"gm","all"))]
[h:"<!-- Will probably need to improve on broadcast targets later -->"]