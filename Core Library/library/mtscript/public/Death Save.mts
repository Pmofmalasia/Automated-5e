[h:ds.Data = macro.args]
[h:ParentToken = json.get(ds.Data,"ParentToken")]

[h:mDeathBonus=0]
[h:mDeathBonusStr=""]
[h:mDeathAdv=""]
[h:mDeathDis=""]
[h:mDeathMessage=""]
[h,foreach(bonus,json.get(MagicItemStats,"iDeathBonus")),CODE:{[mDeathBonus=mDeathBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDeathBonus")),CODE:{[mDeathBonusStr=mDeathBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDeathAdv")),CODE:{[mDeathAdv=listAppend(mDeathAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDeathDis")),CODE:{[mDeathDis=listAppend(mDeathDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDeathMessage")),CODE:{[mDeathMessage=listAppend(mDeathMessage,bonus,"##")]}]

[h:DeathBonus=0]
[h:DeathSaveAdvantage=if(listCount(mDeathAdv)>0,1,0)]
[h:DeathSaveDisadvantage=if(listCount(mDeathDis)>0,1,0)]
[h:DeathSaveAdvDisBalance=if(DeathSaveAdvantage>0,if(DeathSaveDisadvantage>0,0,1),if(DeathSaveDisadvantage>0,-1,0))]
[h:ds.TotalBonus = mDeathBonus+DeathBonus]

[h:DeathSave1=1d20]
[h:DeathSave2=1d20]
[h:DeathSave=if(DeathSaveAdvDisBalance==1,max(DeathSave1,DeathSave2)+mDeathBonus+DeathBonus,if(DeathSaveAdvDisBalance==-1,Min(DeathSave1,DeathSave2)+mDeathBonus+DeathBonus,DeathSave1+mDeathBonus+DeathBonus))]
[h:DeathSaveSuccess=json.get(DeathSaves,"Successes")]
[h:DeathSaveFailure=json.get(DeathSaves,"Failures")]
[h:DeathSaveSuccess=if(DeathSave>9,DeathSaveSuccess+1,DeathSaveSuccess)]
[h:DeathSaveFailure=if(DeathSave<10,DeathSaveFailure+1,DeathSaveFailure)]
[h:DeathSaveFailure=if(DeathSave<2,DeathSaveFailure+1,DeathSaveFailure)]
[h:DeathSaveSuccess=if(DeathSave==20,3,DeathSaveSuccess)]
[h:setState("Dying",if(HP>0,0,state.Dying))]
[h:DeathSaveSuccess=if(state.Dying==0,0,DeathSaveSuccess)]
[h:DeathSaveFailure=if(state.Dying==0,0,DeathSaveFailure)]
[h:DeathProgress=DeathSaveSuccess*10+DeathSaveFailure]

[h,switch(DeathProgress):
				case 0: Flavor="is not dying!";
				case 1: Flavor="is beginning to slip toward death.";
				case 2: Flavor="is at death's door!";
				case 3: Flavor="is dead.";
				case 4: Flavor="is VERY dead!";
				case 10: Flavor="is beginning to stabilize.";
				case 11: Flavor="could go either way.";
				case 12: Flavor="is to slipping closer to death.";
				case 13: Flavor="is dead.";
				case 14: Flavor="is VERY dead!";
				case 20: Flavor="is nearly stable.";
				case 21: Flavor="is becoming more stable.";
				case 22: Flavor="is at the crossroads between life and death!";
				case 23: Flavor="is dead.";
				case 24: Flavor="is VERY dead!";
				case 30: Flavor="has stabilized.";
				case 31: Flavor="has stabilized.";
				case 32: Flavor="has stabilized.";
				default: Flavor="is not dying!"]
[h:Flavor = token.name+" "+Flavor]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",json.get(macro.args,"ParentToken"),
	"DMOnly",0,
	"BorderColorOverride",if(json.get(macro.args,"BorderColorOverride")=="","#000000",json.get(macro.args,"BorderColorOverride")),
	"TitleFontColorOverride",if(json.get(macro.args,"TitleFontColorOverride")=="","#FFFFFF",json.get(macro.args,"TitleFontColorOverride")),
	"AccentBackgroundOverride",json.get(macro.args,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(macro.args,"AccentTextOverride"),
	"TitleFont",json.get(macro.args,"TitleFont"),
	"BodyFont",json.get(macro.args,"BodyFont"),
	"Class","",
	"Name","Death Save",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:ds.Output = json.get(json.get(FormattingData,"Output"),"GM")]

[h:AccentFormat = json.get(FormattingData,"AccentFormat")]
[h:VerticalFormat = json.get(FormattingData,"VerticalFormat")]
[h:VerticalFormatLinks = json.get(FormattingData,"VerticalFormatLinks")]
[h:TableFormat = json.get(FormattingData,"TableFormat")]
[h:outputTest.NoFullMacro = json.get(FormattingData,"NoFullMacro")]
[h:outputTest.NoRolls = json.get(FormattingData,"NoRolls")]
[h:outputTest.NoRules = json.get(FormattingData,"NoRules")]
[h:DamageColor=pm.DamageColor()]
[h:HealingColor=pm.HealingColor()]
[h:CritColor=pm.CritColor()]
[h:CritFailColor=pm.CritFailColor()]
[h:LinkColor=pm.LinkColor()]

[h,if(getState("Dying")==1),CODE:{
	[h,switch(DeathSaveAdvDisBalance),CODE:
		case 1:{
			[h:ds.Roll = max(DeathSave1,DeathSave2)]
			[h:abilityTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header","Saving Throw",
			"FalseHeader","",
			"FullContents","<span style='"+if(ds.Roll==20,"font-size:2em; color:"+HealingColor,if(ds.Roll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em; color:"+if(DeathSave>=10,HealingColor,DamageColor)))+"'>"+(ds.Roll+ds.TotalBonus)+"</span>",
			"RulesContents","1d20"+pm.PlusMinus(DeathBonus,0)+pm.PlusMinus(mDeathBonus,0)+" = ",
			"RollContents",ds.Roll+pm.PlusMinus(DeathBonus,0)+pm.PlusMinus(mDeathBonus,0)+" = ",
			"DisplayOrder","['Rules','Roll','Full']",
			"LinkText","Advantage! Lower d20: "+min(DeathSave1,DeathSave2),
			"Link",macroLinkText("Death Save@Lib:pm.a5e.Core","self-gm",ds.Data,ParentToken),
			"Value",(ds.Roll+ds.TotalBonus)
			))]
		};
		case 0:{
			[h:ds.Roll = DeathSave1]
			[h:abilityTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header","Saving Throw",
			"FalseHeader","",
			"FullContents","<span style='"+if(ds.Roll==20,"font-size:2em; color:"+HealingColor,if(ds.Roll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em; color:"+if(DeathSave>=10,HealingColor,DamageColor)))+"'>"+(ds.Roll+ds.TotalBonus)+"</span>",
			"RulesContents","1d20"+pm.PlusMinus(DeathBonus,0)+pm.PlusMinus(mDeathBonus,0)+" = ",
			"RollContents",ds.Roll+pm.PlusMinus(DeathBonus,0)+pm.PlusMinus(mDeathBonus,0)+" = ",
			"DisplayOrder","['Rules','Roll','Full']",
			"LinkText","Reroll",
			"Link",macroLinkText("Death Save@Lib:pm.a5e.Core","self-gm",ds.Data,ParentToken),
			"Value",(ds.Roll+ds.TotalBonus)
			))]
		};
		case -1:{
			[h:ds.Roll = min(DeathSave1,DeathSave2)]
			[h:abilityTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header","Saving Throw",
			"FalseHeader","",
			"FullContents","<span style='"+if(ds.Roll==20,"font-size:2em; color:"+HealingColor,if(ds.Roll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em; color:"+if(DeathSave>=10,HealingColor,DamageColor)))+"'>"+(ds.Roll+ds.TotalBonus)+"</span>",
			"RulesContents","1d20"+pm.PlusMinus(DeathBonus,0)+pm.PlusMinus(mDeathBonus,0)+" = ",
			"RollContents",min(DeathSave1,DeathSave2)+pm.PlusMinus(DeathBonus,0)+pm.PlusMinus(mDeathBonus,0)+" = ",
			"DisplayOrder","['Rules','Roll','Full']",
			"LinkText","Disadvantage! Higher d20: "+max(DeathSave1,DeathSave2),
			"Link",macroLinkText("Death Save@Lib:pm.a5e.Core","self-gm",ds.Data,ParentToken),
			"Value",(ds.Roll+ds.TotalBonus)
			))]
		}
	]

	[h,if(state.Dying==0),code:{};{
	[h:HP=if(DeathSave==20,1,HP)]}]
	[h:Stable=if(DeathSaveSuccess>2,1,0)]
	[h:DeadDead=if(DeathSaveFailure>2,1,0)]
	[h:setState("Dying",if(Stable>0,0,state.Dying))]
	[h:setState("Dead",if(DeadDead>0,1,state.Dead))]
	[h:DeathSaveSuccess=if(Stable>0,0,DeathSaveSuccess)]
	[h:DeathSaveSuccess=if(DeadDead>0,0,DeathSaveSuccess)]
	[h:DeathSaveSuccess=if(HP>0,0,DeathSaveSuccess)]
	[h:DeathSaveFailure=if(Stable>0,0,DeathSaveFailure)]
	[h:DeathSaveFailure=if(DeadDead>0,0,DeathSaveFailure)]
	[h:DeathSaveFailure=if(HP>0,0,DeathSaveFailure)]
	[h:DeathSaves=json.set("{}","Successes",DeathSaveSuccess,"Failures",DeathSaveFailure)]
	[h:state.Unconscious=if(HP >0,0,state.Unconscious)]
	[h:bar.Health = HP / MaxHP]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Successes",
			"FalseHeader","",
			"FullContents",json.get(DeathSaves,"Successes"),
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']",
			"LinkText","",
			"Link","",
			"Value",json.get(DeathSaves,"Successes")
			))]
			
	[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Failures",
			"FalseHeader","",
			"FullContents",json.get(DeathSaves,"Failures"),
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']",
			"LinkText","",
			"Link","",
			"Value",json.get(DeathSaves,"Failures")
			))]

	[h,foreach(item,mDeathAdv):"<br>&#8226; <b>"+item+":</b> Your "+item+" grants you advantage on this death save."]
	[h,foreach(item,mDeathDis):"<br>&#8226; <b>"+item+":</b> Your "+item+" inflicts disadvantage on this death save."]
	[h,foreach(item,mDeathMessage,"","##"):""+item+""]
	[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
	[h:ds.Output = ds.Output + json.get(output.Temp,"GM")]
};{
	[h:ds.Output = ds.Output + token.name+" is not dying!"]
}]

[h:ds.Output = ds.Output + "</div></div>"]
[h:broadcastAsToken(ds.Output)]