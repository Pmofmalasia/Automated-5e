[h:pm.SpellList = macro.args]

[h,foreach(spell,pm.SpellList),CODE:{
	[h:MainSpellData = json.get(spell,0)]
	[h:pm.CastTimeNote = if(or(json.get(MainSpellData,"CastTime")=="",lower(json.get(MainSpellData,"CastTime"))=="action"),""," <b>("+json.get(MainSpellData,"CastTime")+")</b>")]
	[h:pm.NewMacroLabel = json.get(MainSpellData,"SpellName")+" ("+json.get(MainSpellData,"sLevel")+")"+pm.CastTimeNote]
	[h:pm.NewMacroCommand = '[h:"<!-- Dont mess with these variables unless you know what they do -->"]
[h:ForcedClass=""]
[h:ForcedLevel=""]
[h:DMOnly=0]
[h:InnateCast=0]
[h:MonsterCast=0]

[h:"<!-- The following are customization options to personalize your macros! They wont actually affect calculations or anything -->"]

[h:"<!-- Flavor text that will appear at the start of the macro. The token.name part outputs the name of your token, remove it if you dont want the name of your token in the flavor text. -->"]
[h:Flavor=token.name+" FLAVOR TEXT"]

[h:"<!-- Output messages when you crit or crit fail-->"]
[h:CritMessage=""]
[h:CritFailMessage=""]

[h:"<!-- If the spell has a summon, you can add a name and images. These will override the default images for the tokens when you summon them! The text you need for the images can be found by running the get images macro on your summon after changing them manually the first time. -->"]
[h:SummonName=""]
[h:SummonTokenImage=""]
[h:SummonPortrait=""]
[h:SummonHandout=""]

[h:"<!-- Aura Color Options: White, Red, Orange, Yellow, Blue, Green, Purple, Black. Type the names of these colors to select, case sensitive. -->"]
[h:AuraColor="Green"]

[h:"<!-- Changes the color of the outputs border and title text. Use a hex code for these colors. -->"]
[h:BorderColorOverride=""]
[h:TitleFontColorOverride=""]

[h:"<!-- Changes the font for the title and body of the spell. If a font is not available, it will use the default font. -->"]
[h:TitleFont=""]
[h:BodyFont=""]

[h:"<!--Changes the color of total damage numbers, crits and crit fails. -->"]
[h:DamageNumberOverride=""]
[h:CritTextOverride=""]
[h:CritFailTextOverride=""]

[h:"<!-- Changes the background and font color for accents (e.g. Flavor text section) -->"]
[h:AccentBackgroundOverride=""]
[h:AccentTextOverride=""]

[h:FlavorData = json.set("",
	"Flavor",Flavor,
	"ForcedClass",ForcedClass,
	"ForcedLevel",ForcedLevel,
	"CritMessage",CritMessage,
	"CritFailMessage",CritFailMessage,
	"SummonName",SummonName,
	"SummonTokenImage",SummonTokenImage,
	"SummonPortrait",SummonPortrait,
	"SummonHandout",SummonHandout,
	"DMOnly",DMOnly,
	"InnateCast",InnateCast,
	"MonsterCast",MonsterCast,
	"AuraColor",AuraColor,
	"BorderColorOverride",BorderColorOverride,
	"TitleFontColorOverride",TitleFontColorOverride,
	"TitleFont",TitleFont,
	"BodyFont",BodyFont,
	"DamageNumberOverride",DamageNumberOverride,
	"CritTextOverride",CritTextOverride,
	"CritFailTextOverride",CritFailTextOverride,
	"AccentBackgroundOverride",AccentBackgroundOverride,
	"AccentTextOverride",AccentTextOverride,
	"IsTooltip",0,
	"ParentToken",currentToken())]

[MACRO("'+json.get(MainSpellData,"SpellName")+' ('+json.get(MainSpellData,"sLevel")+')@Lib:Complete Spellbook"): FlavorData]']

	[h:pm.NewMacroTooltip = '[h:Flavor=""][h:BorderColorOverride=""][h:TitleFontColorOverride=""][h:tooltipDisplaySizeOverride=""][h:TitleFont=""][h:BodyFont=""][h:ForcedClass=""][h:DMOnly=0][h:InnateCast=0][h:MonsterCast=0][h:placeholdToAdd=""][h:TooltipData = json.set("","Flavor",Flavor,"BorderColorOverride",BorderColorOverride,"TitleFontColorOverride",TitleFontColorOverride,"tooltipDisplaySizeOverride",tooltipDisplaySizeOverride,"TitleFont",TitleFont,"BodyFont",BodyFont,"ForcedClass",ForcedClass,"DMOnly",DMOnly,"InnateCast",InnateCast,"MonsterCast",MonsterCast,"IsTooltip",1,"placeholdToAdd",placeholdToAdd)][MACRO("'+json.get(MainSpellData,"SpellName")+' ('+json.get(MainSpellData,"sLevel")+')@Lib:Complete Spellbook"): TooltipData]']

	[h:"<!-- Source is temporarily set to Arcane permanently until Divine is implemented -->"]
	[h:DefaultDisplayData = pm.SpellColors(json.set("","Level",string(json.get(MainSpellData,"sLevel")),"Source","Arcane"))]
	[h:BorderColor = json.get(DefaultDisplayData,"Border")]
	[h:TextColor = json.get(DefaultDisplayData,"Title")]

	[h:pm.NewMacroProps = json.set("",
		"applyToSelected",0,
		"autoExecute",1,
		"color",BorderColor,
		"command",pm.NewMacroCommand,
		"fontColor",TextColor,
		"fontSize","1.00em",
		"includeLabel",0,
		"group"," New Spells",
		"sortBy",json.get(MainSpellData,"sLevel"),
		"label",pm.NewMacroLabel,
		"maxWidth","",
		"minWidth",89,
		"playerEditable",0,
		"tooltip",pm.NewMacroTooltip,
		"delim","json"
		)]
	[h:createMacro(pm.NewMacroProps)]
}]