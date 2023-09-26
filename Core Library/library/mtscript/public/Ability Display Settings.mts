[h:MacroOptions = listSort(json.toList(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name!='')]['Name']")),"A+")]

[h:abort(input(
	"chosenMacro | "+MacroOptions+" | Which ability would you like to edit | LIST | VALUE=STRING "
))]

[h:OldMacroSettings = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+chosenMacro+"')]['Settings']")]
[h,if(OldMacroSettings == "[]"): OldMacroSettings="{}";  OldMacroSettings=json.get(OldMacroSettings,0)] 

[h:choice.DM = 0]
[h:CurrentFontOptions = data.getData("addon:","pm.a5e.core","FontOptions")]
[h:CurrentAuraOptions = data.getData("addon:","pm.a5e.core","AuraOptions")]
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
	"ShowFullRulesOverride",choice.FullRules,
	"Flavor",if(choice.Flavor=="0","",choice.Flavor),
	"BorderColorOverride",if(choice.BorderColor=="0","",choice.BorderColor),
	"TitleFontColorOverride",if(choice.TitleColor=="0","",choice.TitleColor),
	"AccentBackgroundOverride",if(choice.AccentColor=="0","",choice.AccentColor),
	"AccentTextColorOverride",if(choice.AccentTextColor=="0","",choice.AccentTextColor),
	"TitleFont",choice.TitleFont,
	"BodyFont",choice.BodyFont,
	"AuraColor",choice.AuraColor
	)]

[h,if(OldMacroSettings=="{}"),CODE:{
	[h:setProperty("a5e.stat.AllFeatures",json.path.put(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+chosenMacro+"')]","Settings",SettingsInfo))]
};{
	[h:setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+chosenMacro+"')]['Settings']",SettingsInfo))]
}]