[h:InitData = macro.args]
[h:Flavor=json.get(InitData,"Flavor")]
[h:ParentToken=json.get(InitData,"ParentToken")]

[h:roll1 = 1d20]
[h:roll2 = 1d20]

[h:pInitiative = if(json.get(MagicItemStats,"iInitProf")==3,1,json.get(MagicItemStats,"iInitProf"))*Proficiency]

[h:mInitBonus=0]
[h:mInitBonusStr=""]
[h:mInitAdv=""]
[h:mInitDis=""]
[h:mInitMessage=""]
[h,foreach(bonus,json.get(MagicItemStats,"iInitBonus")),CODE:{[mInitBonus=mInitBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInitBonus")),CODE:{[mInitBonusStr=mInitBonusStr+pm.PlusMinus(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInitAdv")),CODE:{[mInitAdv=listAppend(mInitAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInitDis")),CODE:{[mInitDis=listAppend(mInitDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInitMessage")),CODE:{[mInitMessage=listAppend(mInitMessage,bonus,"##")]}]

[h:InitiativeAdvantage=if(listCount(mInitAdv)>0,1,0)]
[h:InitiativeDisadvantage=if(listCount(mInitDis)>0,1,0)]
[h:InitAdvDisBalance=if(InitiativeAdvantage>0,if(InitiativeDisadvantage>0,0,1),if(InitiativeDisadvantage>0,-1,0))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(InitData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(InitData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(InitData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(InitData,"AccentTextOverride"),
	"TitleFont",json.get(InitData,"TitleFont"),
	"BodyFont",json.get(InitData,"BodyFont"),
	"Class","zzInitiative",
	"Name","Initiative",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:baseBonus = json.get(AtrMods,"Dexterity")]
[h:profBonus = pInitiative]
[h:in.TotalBonus = baseBonus + profBonus]

[h,switch(InitAdvDisBalance),CODE:
	case 1:{
		[h:InitRoll = max(roll1,roll2)]
		[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header","Initiative",
		"FalseHeader","",
		"FullContents","<span style='"+if(InitRoll==20,"font-size:2em; color:"+CritColor,if(InitRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(InitRoll+in.TotalBonus)+"</span>",
		"RulesContents","1d20 + Dex = ",
		"RollContents",InitRoll+pm.PlusMinus(baseBonus,1)+pm.PlusMinus(profBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"LinkText","Advantage! Lower d20: "+min(roll1,roll2),
		"Link",macroLinkText("Initiative@Lib:pm.a5e.Core","self-gm",InitData,ParentToken),
		"Value",(InitRoll+in.TotalBonus)
		))]
	};
	case 0:{
		[h:InitRoll = roll1]
		[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header","Initiative",
		"FalseHeader","",
		"FullContents","<span style='"+if(InitRoll==20,"font-size:2em; color:"+CritColor,if(InitRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(InitRoll+in.TotalBonus)+"</span>",
		"RulesContents","1d20 + Dex = ",
		"RollContents",InitRoll+pm.PlusMinus(baseBonus,1)+pm.PlusMinus(profBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"LinkText","Reroll",
		"Link",macroLinkText("Initiative@Lib:pm.a5e.Core","self-gm",InitData,ParentToken),
		"Value",(InitRoll+in.TotalBonus)
		))]
	};
	case -1:{
		[h:InitRoll = min(roll1,roll2)]
		[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header","Initiative",
		"FalseHeader","",
		"FullContents","<span style='"+if(InitRoll==20,"font-size:2em; color:"+CritColor,if(InitRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(InitRoll+in.TotalBonus)+"</span>",
		"RulesContents","1d20 + Dex = ",
		"RollContents",min(roll1,roll2)+pm.PlusMinus(baseBonus,1)+pm.PlusMinus(profBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"LinkText","Disadvantage! Higher d20: "+max(roll1,roll2),
		"Link",macroLinkText("Initiative@Lib:pm.a5e.Core","self-gm",InitData,ParentToken),
		"Value",(InitRoll+in.TotalBonus)
		))]
		}
]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm"))]

[h:addToInitiative()]
[h:setInitiative(InitRoll+in.TotalBonus+(json.get(AtrMods,"Dexterity")/100))]
[h:sortInitiative()]

[h:"<!-- Below is legacy code for magic items / passive abilities that will need to be reworked -->"]

[h,foreach(ability,json.path.read(allAbilities,"[?(@.IsActive>0 && @.CallAfterInit==1)]")): evalMacro("[r:pm."+replace(json.get(ability,"Name")," ","")+json.get(ability,"Class")+"('AfterInit')]")]

[h,foreach(item,mInitAdv):"<br>&#8226; <b>"+item+":</b> Your "+item+" grants you advantage on this initiative roll."]
[h,foreach(item,mInitDis):"<br>&#8226; <b>"+item+":</b> Your "+item+" inflicts disadvantage on this initiative roll."]
[h,foreach(item,mInitMessage,"","##"):""+item+""]