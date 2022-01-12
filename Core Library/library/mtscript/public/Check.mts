[h:ch.Data = macro.args]
[h:roll1=1d20]
[h:roll2=1d20]
[h:SkillBonus=0]

[h:ch.Adv = 0]
[h:ch.Dis = 0]
[h,foreach(ability,json.path.read(ConditionList,"[?(@.CallCheckAdv==1)]")): evalMacro("[h:pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"Condition('CheckAdv')]")]

[h:"<!-- Note: I dont think alternate numerical bonuses calculate correctly with magic items but i cant be bothered to fix it right now. when i am bothered to fix it subtract the original magic bonus from skillbonus and add the new one -->"]
[h,switch(json.get(ch.Data,"Alternate")),code:
	case "-NO-": {[h:mBonusAlternateStr=""][h:mBonusAlternate=0][h:mAdvAlternate=""][h:mDisAlternate=""][h:mMessageAlternate=""]};
	case "Str": {[h:mBonusAlternateStr=mStrBonusStr][h:mBonusAlternate=mStrBonus][h:mAdvAlternate=mStrAdv][h:mDisAlternate=mStrDis][h:mMessageAlternate=mStrMessage]};
	case "Dex": {[h:mBonusAlternateStr=mDexBonusStr][h:mBonusAlternate=mDexBonus][h:mAdvAlternate=mDexAdv][h:mDisAlternate=mDexDis][h:mMessageAlternate=mDexMessage]};
	case "Con": {[h:mBonusAlternateStr=mConBonusStr][h:mBonusAlternate=mConBonus][h:mAdvAlternate=mConAdv][h:mDisAlternate=mConDis][h:mMessageAlternate=mConMessage]};
	case "Int": {[h:mBonusAlternateStr=mIntBonusStr][h:mBonusAlternate=mIntBonus][h:mAdvAlternate=mIntAdv][h:mDisAlternate=mIntDis][h:mMessageAlternate=mIntMessage]};
	case "Wis": {[h:mBonusAlternateStr=mWisBonusStr][h:mBonusAlternate=mWisBonus][h:mAdvAlternate=mWisAdv][h:mDisAlternate=mWisDis][h:mMessageAlternate=mWisMessage]};
	case "Cha": {[h:mBonusAlternateStr=mChaBonusStr][h:mBonusAlternate=mChaBonus][h:mAdvAlternate=mChaAdv][h:mDisAlternate=mChaDis][h:mMessageAlternate=mChaMessage]}
	]

[h:FormattingData = json.get(ch.Data,"Formatting")]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:output.PC = json.get(json.get(ch.Data,"Output"),"Player")]
[h:output.GM = json.get(json.get(ch.Data,"Output"),"GM")]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header",json.get(ch.Data,"DisplayName"),
	"FalseHeader","",
	"FullContents","<span style='"+if(roll1==20,"font-size:2em; color:"+CritColor,if(roll1==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(roll1+json.get(ch.Data,"Bonus"))+"</span>",
	"RulesContents","1d20 + "+substring(json.get(ch.Data,"Attribute"),0,3)+json.get(ch.Data,"BonusDisplay")+" = ",
	"RollContents",roll1+json.get(ch.Data,"BonusFromAttributeDisplay")+json.get(ch.Data,"BonusDisplay")+" = ",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","Reroll",
	"Link",macroLinkText("Check Reroll@Lib:pm.a5e.Core","all",ch.Data,json.get(ch.Data,"ParentToken")),
	"Value",(roll1+json.get(ch.Data,"Bonus"))
	))]
[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:macro.return = json.set("","Player",(output.PC+json.get(output.Temp,"Player")),"GM",(output.GM+json.get(output.Temp,"GM")),"Result",(roll1+json.get(ch.Data,"Bonus")))]