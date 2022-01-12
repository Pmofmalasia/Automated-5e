[h:FontsList="Default,Century Gothic,Comic Sans MS,Courier New,Georgia,Lucida Bright,Papyrus,Tahoma,Times New Roman,Trebuchet MS,Verdana,Custom"]
[h:NPCOptionsList="Show All Rules,Show Rolls but not Rules,Show Result of Rolls Only,Show Nothing"]

[h:"<!-- If max-width becomes supported, can add Maximum Width between Fixed and Unlimited. Also, if it becomes supported, the current unlimited option will automatically swap to max. -->"]
[h:"<!-- Could add saved settings for presets, in addition to returning to default -->"]

[h:display.settings=input(
	"junkVar | ---------------------------------------- Display Settings ---------------------------------------- | | LABEL | SPAN=TRUE",
	"choice.Default | | Restore Default Settings | CHECK",
	"choice.Width | Fixed Width,Unlimited Width | Chat Output Width Options | LIST | SELECT="+getLibProperty("useWidth","Lib:pm.a5e.Core")+" ",
	"choice.DisplaySize | "+getLibProperty("DisplaySize","Lib:pm.a5e.Core")+" | Display Width ",
	"choice.DarkMode | "+getLibProperty("DarkMode","Lib:pm.a5e.Core")+" | Use Dark Mode | CHECK",
	"choice.Vertical | "+getLibProperty("VerticalDisplay","Lib:pm.a5e.Core")+" | Use Vertical Display | CHECK",
    "choice.ShowDice | "+getLibProperty("ShowAllDice","Lib:pm.a5e.Core")+" | Show Individual Die Rolls | CHECK",
    "choice.AlwaysAdvDis | "+getLibProperty("AlwaysAdvDis","Lib:pm.a5e.Core")+" | Always Roll Advantage and Disadvantage | CHECK",
    "choice.FullSpellRules | "+getLibProperty("FullSpellRules","Lib:pm.a5e.Core")+" | Show Full Spell Rules by Default | CHECK",
	"choice.FullAbilityRules | "+getLibProperty("FullAbilityRules","Lib:pm.a5e.Core")+" | Always Show Full Ability Rules in Chat | CHECK",
	"junkVar | ------------------------------ Color Settings: Use Hex Codes ------------------------------ | | LABEL | SPAN=TRUE",
	"choice.DarkBackground | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkBackground")+" | Dark Mode Background Color",
	"choice.DarkText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkText")+" | Dark Mode Text Color",
	"choice.DarkAccent | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkAccentBackground")+" | Dark Mode Accent Color",
	"choice.DarkAccentText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkAccentText")+" | Dark Mode Accent Text Color",
	"choice.DarkDamageText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkDamageText")+" | Dark Mode Damage Text Color",
	"choice.DarkHealingText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkHealingText")+" | Dark Mode Healing Text Color",
	"choice.DarkCritText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkCritText")+" | Dark Mode Critical Hit Color",
	"choice.DarkCritFailText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkCritFailText")+" | Dark Mode Critical Miss Color",
	"choice.DarkLink | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkLinkColor")+" | Dark Mode Link Color",
	"junkVar | -------------------------------------------------------------------------------------------------------- | | LABEL | SPAN=TRUE",
    "choice.LightBackground | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightBackground")+" | Light Mode Background Color",
    "choice.LightText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightText")+" | Light Mode Text Color",
    "choice.LightAccent | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightAccentBackground")+" | Light Mode Accent Color",
    "choice.LightAccentText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightAccentText")+" | Light Mode Accent Text Color",
    "choice.LightDamageText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightDamageText")+" | Light Mode Damage Text Color",
    "choice.LightHealingText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightHealingText")+" | Light Mode Healing Text Color",
    "choice.LightCritText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightCritText")+" | Light Mode Critical Hit Color",
    "choice.LightCritFailText | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightCritFailText")+" | Light Mode Critical Miss Color",
    "choice.LightLink | "+json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightLinkColor")+" | Light Mode Link Color",
	"junkVar | ------------------------------------------ Font Settings ------------------------------------------ | | LABEL | SPAN=TRUE",
	"choice.TitleFont | "+getLibProperty("FontOptions","Lib:pm.a5e.Core")+" | Choose Title Font | LIST | VALUE=STRING ",
	"choice.BodyFont | "+getLibProperty("FontOptions","Lib:pm.a5e.Core")+" | Choose Body Font | LIST | VALUE=STRING ",
	"junkVar | ------------------------------------- NPC Macro Settings ------------------------------------- | | LABEL | SPAN=TRUE",
    "choice.HideAllyMacros | "+NPCOptionsList+" | Info Shown to Players for Allies | LIST | SELECT="+getLibProperty("HideAllyMacros","Lib:pm.a5e.Core")+"",
    "choice.HideEnemyMacros | "+NPCOptionsList+" | Info Shown to Players for Enemies | LIST | SELECT="+getLibProperty("HideEnemyMacros","Lib:pm.a5e.Core")+""
)]
[h:abort(display.settings)]

[h,if(or(choice.TitleFont=="Custom",choice.BodyFont=="Custom") && choice.Default == 0),CODE:{
	[h:disTitleFont=if(choice.TitleFont=="Custom","choice.TitleFont |  | Type in the name of your Title Font","")]
	[h:disBodyFont=if(choice.BodyFont=="Custom","choice.BodyFont |  | Type in the name of your Body Font","")]
	[h:FontSelect=input(
		"junkVar | Note: If your custom font is not supported, it will show as the MapTool default. | | LABEL | SPAN=TRUE ",
		""+disTitleFont+"",
		""+disBodyFont+""
		)]
};{}]

[h,if(choice.Default),CODE:{
	[h:choice.Width=0]
	[h:choice.DisplaySize=400]
	[h:choice.DarkMode=1]
	[h:choice.Vertical=0]
	[h:choice.FullSpellRules=0]
	[h:choice.FullAbilityRules=0]
	[h:choice.DarkBackground="27241D"]
	[h:choice.DarkText="FAF9F7"]
	[h:choice.DarkAccent="504A40"]
	[h:choice.DarkAccentText="FAF9F7"]
	[h:choice.DarkDamageText="AA2222"]
    [h:choice.DarkHealingText="22AA22"]
	[h:choice.DarkCritText="AA2222"]
	[h:choice.DarkCritFailText="00B8D9"]
	[h:choice.DarkLink="FF0000"]
    [h:choice.LightBackground="FAF9F7"]
    [h:choice.LightText="27241D"]
    [h:choice.LightAccent="D3CEC4"]
    [h:choice.LightAccentText="27241D"]
    [h:choice.LightDamageText="AA2222"]
    [h:choice.LightHealingText="22AA22"]
    [h:choice.LightCritText="AA2222"]
    [h:choice.LightCritFailText="00B8D9"]
    [h:choice.LightLink="303F9F"]	
    [h:choice.ShowDice=1]
    [h:choice.TitleFont="Default"]
    [h:choice.BodyFont="Default"]
};{}]

[h:choice.Colors=json.set("","DarkBackground",choice.DarkBackground,"DarkText",choice.DarkText,"DarkAccentBackground",choice.DarkAccent,"DarkAccentText",choice.DarkAccentText,"DarkDamageText",choice.DarkDamageText,"DarkHealingText",choice.DarkHealingText,"DarkCritText",choice.DarkCritText,"DarkCritFailText",choice.DarkCritFailText,"DarkLinkColor",choice.DarkLink,"LightBackground",choice.LightBackground,"LightText",choice.LightText,"LightAccentBackground",choice.LightAccent,"LightAccentText",choice.LightAccentText,"LightDamageText",choice.LightDamageText,"LightHealingText",choice.LightHealingText,"LightCritText",choice.LightCritText,"LightCritFailText",choice.LightCritFailText,"LightLinkColor",choice.LightLink)]

[h:choice.Font=json.set("","Title",choice.TitleFont,"Body",choice.BodyFont)]

[h:setLibProperty("useWidth",choice.Width,"Lib:pm.a5e.Core")]
[h:setLibProperty("DisplaySize",choice.DisplaySize,"Lib:pm.a5e.Core")]
[h:setLibProperty("DarkMode",choice.DarkMode,"Lib:pm.a5e.Core")]
[h:setLibProperty("VerticalDisplay",choice.Vertical,"Lib:pm.a5e.Core")]
[h:setLibProperty("AlwaysAdvDis",choice.AlwaysAdvDis,"Lib:pm.a5e.Core")]
[h:setLibProperty("FullSpellRules",choice.FullSpellRules,"Lib:pm.a5e.Core")]
[h:setLibProperty("FullAbilityRules",choice.FullAbilityRules,"Lib:pm.a5e.Core")]
[h:setLibProperty("ChatColors",choice.Colors,"Lib:pm.a5e.Core")]
[h:setLibProperty("ChatFonts",choice.Font,"Lib:pm.a5e.Core")]
[h:setLibProperty("ShowAllDice",choice.ShowDice,"Lib:pm.a5e.Core")]
[h:setLibProperty("HideAllyMacros",choice.HideAllyMacros,"Lib:pm.a5e.Core")]
[h:setLibProperty("HideEnemyMacros",choice.HideEnemyMacros,"Lib:pm.a5e.Core")]

[r,g:"Global chat settings updated."]