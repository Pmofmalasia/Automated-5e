[h:MacroGroupNames = ""]
["<!-- If only there was a getMacroGroups().... -->"]
[h,foreach(ButtonName,getMacros("json")),code:{
	[h,foreach(ButtonIndex,getMacroIndexes(ButtonName,"json")),code:{
		[h:MacroGroup = json.get(getMacroProps(ButtonIndex,"json"),"group")]
		[h:MacroGroupNames = if(listContains(MacroGroupNames,MacroGroup),MacroGroupNames,listAppend(MacroGroupNames,MacroGroup))]
	}]
}]

[h:MacroGroupNames = listSort(MacroGroupNames,"A+")]

[h:abort(input("chosenGroup | "+MacroGroupNames+" | Which group is the macro you would like to edit in | LIST | VALUE=STRING "))]

[h:MacroOptions = ""]
[h,foreach(ButtonIndex,getMacroGroup(chosenGroup,"json")),code:{
	[h:MacroLabel = json.get(getMacroProps(ButtonIndex,"json"),"label")]
	[h:MacroOptions = if(listContains(MacroOptions,MacroLabel),MacroOptions,listAppend(MacroOptions,MacroLabel))]
}]

[h:MacroOptions = listSort(MacroOptions,"A+")]

[h:abort(input(
	"chosenMacro | "+MacroOptions+" | Which macro would like to edit | LIST | VALUE=STRING ",
	"macroType | Class Feature,Spell,Attack,Other | What type of ability is this macro | LIST "
))]

[h:OldMacroSettings = json.path.read(ButtonSettings,"\$[?(@.Name=='"+chosenMacro+"')]")]
[h,if(OldMacroSettings == "[]"): OldMacroSettings="{}";OldMacroSettings=json.get(OldMacroSettings,0)] 

[h:CurrentFontOptions = data.getData("addon:","pm.a5e.core","FontOptions")]
[h:CurrentAuraOptions = data.getData("addon:","pm.a5e.core","AuraOptions")]
[h,if(macroType==0),CODE:{
	[h:choice.DM = 0]
	[h:abort(input(
		"junkVar | -------------- Settings by Button: 0 or Blank to Use Defaults -------------- | | LABEL | SPAN=TRUE ",
		if(isGM(),"choice.DM | "+if(json.get(OldMacroSettings,"DMOnly")=="",if(getProperty("a5e.stat.Allegiance")=="Enemy",1,0),json.get(OldMacroSettings,"DMOnly"))+" | Separate DM and player outputs | CHECK ","")+"",
		"choice.FullRules | "+json.get(OldMacroSettings,"ShowFullRulesOverride")+" | Show full rules in chat | CHECK ",
		"choice.Flavor | "+json.get(OldMacroSettings,"Flavor")+" | Ability flavor text ",
		"choice.BorderColor | "+json.get(OldMacroSettings,"BorderColorOverride")+" | Border Color",
		"choice.TitleColor | "+json.get(OldMacroSettings,"TitleFontColorOverride")+" | Title Text Color",
		"choice.AccentColor | "+json.get(OldMacroSettings,"AccentBackgroundOverride")+" | Accent Color",
		"choice.AccentTextColor | "+json.get(OldMacroSettings,"AccentTextColorOverride")+" | Accent Text Color",
		"choice.TitleFont | "+CurrentFontOptions+" | Title Font | LIST | SELECT="+if(listFind(CurrentFontOptions,json.get(OldMacroSettings,"TitleFont"))==-1,0,listFind(CurrentFontOptions,json.get(OldMacroSettings,"TitleFont")))+" VALUE=STRING",
		"choice.BodyFont | "+CurrentFontOptions+" | Body Font | LIST | SELECT="+if(listFind(CurrentFontOptions,json.get(OldMacroSettings,"BodyFont"))==-1,0,listFind(CurrentFontOptions,json.get(OldMacroSettings,"BodyFont")))+" VALUE=STRING",
		"choice.AuraColor | "+CurrentAuraOptions+" | Aura Color | LIST | SELECT="+if(listFind(CurrentAuraOptions,json.get(OldMacroSettings,"AuraColor"))==-1,0,listFind(CurrentAuraOptions,json.get(OldMacroSettings,"AuraColor")))+" VALUE=STRING"
	))]
	
	[h:SettingsInfo = json.set("",
	"Name",chosenMacro,
	"DMOnly",choice.DM,
	"Flavor",choice.Flavor,
	"ShowFullRulesOverride",choice.FullRules,
	"BorderColorOverride",if(choice.BorderColor=="0","",choice.BorderColor),
	"TitleFontColorOverride",if(choice.TitleColor=="0","",choice.TitleColor),
	"AccentBackgroundOverride",if(choice.AccentColor=="0","",choice.AccentColor),
	"AccentTextColorOverride",if(choice.AccentTextColor=="0","",choice.AccentTextColor),
	"TitleFont",choice.TitleFont,
	"BodyFont",choice.BodyFont,
	"AuraColor",choice.AuraColor
	)]
	
	[h:CurrentSettingsTest = json.path.read(ButtonSettings,"\$[?(@.Name=='"+chosenMacro+"')]")]
	[h,if(CurrentSettingsTest=="[]"),code:{
		[h:ButtonSettings=json.append(ButtonSettings,SettingsInfo)]
	};{
		[h:ButtonSettings=json.path.delete(ButtonSettings,"\$[?(@.Name=='"+chosenMacro+"')]")]
		[h:ButtonSettings=json.append(ButtonSettings,SettingsInfo)]
	}]
};{}]

[h,if(macroType==1),CODE:{
	[h:abort(input(
		"chosenMacro | "+MacroOptions+" | Which macro would like to edit | LIST | VALUE=STRING ",
		"macroType | Class Feature,Spell,Attack,Other | What type of ability is this macro | LIST "
	))]
};{}]

[h,if(macroType==2),CODE:{
	[h:"<!-- Will redirect to weapon specific macro in the future --!>"]
};{}]