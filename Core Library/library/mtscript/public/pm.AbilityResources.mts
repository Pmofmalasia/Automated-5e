[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.ResourceName=arg(1)]
[h:pm.ResourceVarName=arg(2)]

[h:pm.ResourceType=json.type(arg(3))]
[h,if(pm.ResourceType=="OBJECT"),CODE:{
	[h:pm.ResourceUsed=if(pm.Tooltip,0,json.get(arg(3),"Amount"))]
	[h:pm.ResourceUsedMax=if(json.get(arg(3),"Max")=="",pm.ResourceUsed,json.get(arg(3),"Max"))]
	[h:pm.SpellLevelMin=if(json.get(arg(3),"SpellLevelMin")=="",1,json.get(arg(3),"SpellLevelMin"))]
	[h:pm.SpellLevelMax=if(json.get(arg(3),"SpellLevelMax")=="",99,json.get(arg(3),"SpellLevelMax"))]
	[h:pm.BackupResource=json.get(arg(3),"BackupResource")]
	[h:pm.ResourceChoiceMsg=json.get(arg(3),"ChoiceMsg")]
	[h:BackupTest=0]
	[h:pm.ResourceKey=json.get(arg(3),"ResourceKey")]
};{
	[h:pm.SpellLevelMin=1]
	[h:pm.SpellLevelMax=99]
	[h:pm.BackupResource=""]
	[h:pm.ResourceChoiceMsg=""]
	[h:BackupTest=0]
	[h:pm.ResourceUsed=if(pm.Tooltip,0,arg(3))]
	[h:pm.ResourceKey=""]
	[h:pm.ResourceUsedMax=pm.ResourceUsed]
}]
[h:pm.SpellOption=arg(4)]
[h:"<!-- 0 = No option for spell usage; 1 = Exclusively spell slot usage; 2 = Use spells when out of resource; 3 = Can use spells or resource at any time -->"]

[h,if(argCount()>5),CODE:{[h:pm.ResourceRestorationSpecial=if(arg(5)=="","",", "+arg(5))]};{[h:pm.ResourceRestorationSpecial=""]}]
[h:pm.ResourceRestoration = " - Restored on "+if(json.contains(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['RestoreShortRest']"),1),"Short and ","")+"Long Rests"+pm.ResourceRestorationSpecial]

[h:"<!-- The logic here is super obnoxious to avoid hitting 2 levels of CODE blocks. Sorry future self and/or anyone else reading this. -->"]
[h:"<!-- Basic setup: if it must use spells, then go to the spell select screen. Warlock abilities must use Warlock spells. -->"]
[h:"<!-- If resources are the only option, then it checks to see if there is a choice of how much of the resource to use. If not it passes straight through. If so, input. -->"]
[h:"<!-- If both are an option, it first checks to see if there is any resource left. If yes and all resource must be exhausted before moving to spell slots, then it passes through. No support for using a variable amount of the resource in this path. -->"]
[h:"<!-- If there is no resource left or either can be used at any time, then the full input is displayed. -->"]
[h:"<!-- In any of the above cases, if a spell slot was used it is indicated via UseSpellSlotTest. The correct resource (spell or ability) is then deducted and the display will correspond to the resource used. -->"]

[h,if(pm.SpellOption==1),CODE:{

	[h:"<!-- Input for choosing spell slot to use, Warlock abilities bypassing the input as they will always use Warlock spell slots. -->"]
	[h,if(pm.Class=="Warlock"),CODE:{
		[h:pm.dLevelSel=if(pm.ResourceUsed==0,"",if(json.get(SpellSlots,"W")==0,
		"pm.ResourceChoice| 0 | No spell slots remaining! 'OK' will still run the ability, marked as insufficient resource. | LABEL | SPAN=TRUE",""))]
		[h:pm.dAbilityInfo=if(pm.ResourceUsed==0,"",if(json.get(SpellSlots,"W")==0,"junk| <html><span style='align:center'>"+pm.Ability+"</span></html> ||LABEL|SPAN=TRUE",""))]
		[h:pm.ResourceChoice=if(pm.ResourceUsed==0,"0","W")]
	
		[h:abort(input(
		""+pm.dAbilityInfo+"",
		""+pm.dLevelSel+""))]
	};{

		[h:LevelOptions=
		if(and(pm.SpellLevelMin<=1,pm.SpellLevelMax>=1,json.get(SpellSlots,"1")>0),"1st Level,","")
		+if(and(pm.SpellLevelMin<=2,pm.SpellLevelMax>=2,json.get(SpellSlots,"2")>0),"2nd Level,","")
		+if(and(pm.SpellLevelMin<=3,pm.SpellLevelMax>=3,json.get(SpellSlots,"3")>0),"3rd Level,","")
		+if(and(pm.SpellLevelMin<=4,pm.SpellLevelMax>=4,json.get(SpellSlots,"4")>0),"4th Level,","")
		+if(and(pm.SpellLevelMin<=5,pm.SpellLevelMax>=5,json.get(SpellSlots,"5")>0),"5th Level,","")
		+if(and(pm.SpellLevelMin<=6,pm.SpellLevelMax>=6,json.get(SpellSlots,"6")>0),"6th Level,","")
		+if(and(pm.SpellLevelMin<=7,pm.SpellLevelMax>=7,json.get(SpellSlots,"7")>0),"7th Level,","")
		+if(and(pm.SpellLevelMin<=8,pm.SpellLevelMax>=8,json.get(SpellSlots,"8")>0),"8th Level,","")
		+if(and(pm.SpellLevelMin<=9,pm.SpellLevelMax>=9,json.get(SpellSlots,"9")>0),"9th Level,","")
		+if(and(pm.SpellLevelMin<=WSpellLevel,pm.SpellLevelMax>=WSpellLevel,json.get(SpellSlots,"W")>0),"Warlock Spell,","")]

		[h:pm.dAbilityInfo=if(pm.ResourceUsed==0,"","junk| <html><span style='align:center'>"+pm.Ability+"</span></html> | |LABEL|SPAN=TRUE")]
		[h:disResourceChoiceMsg=if(or(pm.ResourceUsed==pm.ResourceUsedMax,pm.ResourceChoiceMsg==""),"","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
		[h:pm.dLevelSel=if(pm.ResourceUsed==0,"",if(LevelOptions=="",
		"pm.ResourceChoice| No spell slots remaining! 'OK' will still run the ability, marked as insufficient resource. | 0 | LABEL | SPAN=TRUE",
		"pm.ResourceChoice|"+LevelOptions+"|Choose Spell Level Used|LIST|VALUE=STRING"))]
		[h:pm.ResourceChoice="0"]
	
		[h:abort(input(
		""+pm.dAbilityInfo+"",
		disResourceChoiceMsg,
		""+pm.dLevelSel+""))]
	}]
	[h:UseSpellSlotTest=1]
};{
	[h:"<!-- Note: math.arraySum to support having the same resource from two separate locations (e.g. having an ability naturally and through a magic item). May swap for math.arrayMax  since technically they should only benefit from an ability once? But the current implementation supports the more likely scenario of users incorrectly adding an ability to gain more resource (though still hopefully also unlikely) -->"]

	[h,if(pm.ResourceKey!=""),CODE:{
		[h:pm.ResourceAmount = json.get(json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['Resource']"),0),pm.ResourceKey)]
		[h:pm.MaxResourceBase = json.get(json.get(json.evaluate(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['MaxResource']")),0),pm.ResourceKey)]
	};{
		[h:pm.ResourceAmount = math.arraySum(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['Resource']"))]
		[h:pm.MaxResourceBase = math.arraySum(json.evaluate(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['MaxResource']")))]
	}]

	[h:miMaxResourceBonus=json.path.read(MagicItemClassBonuses,"[?(@.IsActive>0 && @.Ability=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.MaxResourceBonus!=0)]['MaxResourceBonus']")]
	[h,if(json.isEmpty(miMaxResourceBonus)): miMaxResourceBonusFinal = 0 ; miMaxResourceBonusFinal = math.arraySum(miMaxResourceBonus)]
	[h:pm.ResourceMax=miMaxResourceBonusFinal+pm.MaxResourceBase]

	[h,if(pm.BackupResource==""),CODE:{
		[h:pm.BackupResourceOptions=""]
		[h:pm.BackupResourceRestoration = ""]
	};{
		[h:pm.BackupResourceAmount = math.arraySum(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.BackupResource+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['Resource']"))]
		[h:pm.MaxBackupResourceBase = math.arraySum(json.evaluate(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.BackupResource+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['MaxResource']")))]

		[h:miMaxBackupResourceBonus=json.path.read(MagicItemClassBonuses,"[?(@.IsActive>0 && @.Ability=='"+pm.BackupResource+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.MaxResourceBonus!=0)]['MaxResourceBonus']")]
		[h,if(json.isEmpty(miMaxBackupResourceBonus)):miMaxBackupResourceBonusFinal=0;miMaxBackupResourceBonusFinal=math.arraySum(miMaxBackupResourceBonus)]
		[h:pm.BackupResourceMax=miMaxBackupResourceBonusFinal+pm.MaxBackupResourceBase]
		[h:pm.BackupResourceOptions=""]
		[h:pm.BackupResourceOptionsCount=(min(pm.BackupResourceAmount,pm.ResourceUsedMax)-(pm.ResourceUsed-1))]
		[h,count(pm.BackupResourceOptionsCount):pm.BackupResourceOptions=pm.BackupResourceOptions+(roll.count+pm.ResourceUsed)+","]
		[h:pm.BackupResourceRestoration = " - Restored on "+if(json.contains(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.BackupResource+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['RestoreShortRest']"),1),"Short and ","")+"Long Rests"]
	}]

	[h:"<!-- Repeats application of item bonuses if an ability is using the resource provided by another ability - allows bonuses to only Cutting Words and not all of Bardic Insp, etc. Should not work correctly with backup resources yet. -->"]
	[h,if(pm.Ability == pm.ResourceVarName),CODE:{};{
		[h:miMaxResourceBonus=json.path.read(MagicItemClassBonuses,"[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.MaxResourceBonus!=0)]['MaxResourceBonus']")]
		[h,if(json.isEmpty(miMaxResourceBonus)): miMaxResourceBonusFinal = 0 ; miMaxResourceBonusFinal = math.arraySum(miMaxResourceBonus)]
		[h:pm.ResourceMax=miMaxResourceBonusFinal+pm.MaxResourceBase]
	}]
	
	[h:pm.ResourceUsed = if(pm.ResourceUsed=="Max",pm.ResourceMax,pm.ResourceUsed)]

	[h,if(pm.SpellOption==0),CODE:{
		[h:UseSpellSlotTest=0]
		[h:BackupTest=if(and(pm.BackupResource!="",or(pm.ResourceAmount==0,pm.ResourceAmount<pm.ResourceUsed)),1,0)]
		[h:pm.ResourceOptions=""]
		[h:pm.ResourceOptionsCount=(min(pm.ResourceAmount,pm.ResourceUsedMax)-(pm.ResourceUsed-1))]
		[h,count(pm.ResourceOptionsCount):pm.ResourceOptions=pm.ResourceOptions+(roll.count+pm.ResourceUsed)+","]
		[h:disResourceChoiceMsg=if(or(pm.ResourceUsed==pm.ResourceUsedMax,pm.ResourceChoiceMsg==""),"","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
		[h:disResourceChoice=if(pm.ResourceUsed==pm.ResourceUsedMax,"","pm.ResourceUsed | Cancel,"+if(BackupTest,pm.BackupResourceOptions,pm.ResourceOptions)+" | Choose how many "+if(BackupTest,pm.BackupResource,pm.ResourceName)+" to use | LIST | SELECT=1 VALUE=STRING")]
		[h:pm.ResourceChoice="0"]
		[h:abort(input(
			disResourceChoiceMsg,
			disResourceChoice))]
	};{
		[h:"2 = Use spells when out of resource; 3 = Can use spells or resource at any time"]
		[h:pm.ResourceEnough = if(pm.ResourceAmount-pm.ResourceUsed<0,0,1)]
		[h:disResourceOptions = if(pm.SpellOption==3,
			if(pm.ResourceEnough==1,pm.ResourceName+",","")
			+if(pm.Class=="Warlock",if(and(pm.SpellLevelMin<=WSpellLevel,pm.SpellLevelMax>=WSpellLevel,json.get(SpellSlots,"W")>0),"Warlock Spell,","")
			,if(and(pm.SpellLevelMin<=1,pm.SpellLevelMax>=1,json.get(SpellSlots,"1")>0),"1st Level,","")
			+if(and(pm.SpellLevelMin<=2,pm.SpellLevelMax>=2,json.get(SpellSlots,"2")>0),"2nd Level,","")
			+if(and(pm.SpellLevelMin<=3,pm.SpellLevelMax>=3,json.get(SpellSlots,"3")>0),"3rd Level,","")
			+if(and(pm.SpellLevelMin<=4,pm.SpellLevelMax>=4,json.get(SpellSlots,"4")>0),"4th Level,","")
			+if(and(pm.SpellLevelMin<=5,pm.SpellLevelMax>=5,json.get(SpellSlots,"5")>0),"5th Level,","")
			+if(and(pm.SpellLevelMin<=6,pm.SpellLevelMax>=6,json.get(SpellSlots,"6")>0),"6th Level,","")
			+if(and(pm.SpellLevelMin<=7,pm.SpellLevelMax>=7,json.get(SpellSlots,"7")>0),"7th Level,","")
			+if(and(pm.SpellLevelMin<=8,pm.SpellLevelMax>=8,json.get(SpellSlots,"8")>0),"8th Level,","")
			+if(and(pm.SpellLevelMin<=9,pm.SpellLevelMax>=9,json.get(SpellSlots,"9")>0),"9th Level,","")
			+if(and(pm.SpellLevelMin<=WSpellLevel,json.get(SpellSlots,"W")>0),"Warlock Spell,","")),
			if(pm.ResourceEnough==1,"",
			if(pm.Class=="Warlock",if(and(pm.SpellLevelMin<=WSpellLevel,pm.SpellLevelMax>=WSpellLevel,json.get(SpellSlots,"W")>0),"Warlock Spell,",""),
			if(and(pm.SpellLevelMin<=1,pm.SpellLevelMax>=1,json.get(SpellSlots,"1")>0),"1st Level,","")
			+if(and(pm.SpellLevelMin<=2,pm.SpellLevelMax>=2,json.get(SpellSlots,"2")>0),"2nd Level,","")
			+if(and(pm.SpellLevelMin<=3,pm.SpellLevelMax>=3,json.get(SpellSlots,"3")>0),"3rd Level,","")
			+if(and(pm.SpellLevelMin<=4,pm.SpellLevelMax>=4,json.get(SpellSlots,"4")>0),"4th Level,","")
			+if(and(pm.SpellLevelMin<=5,pm.SpellLevelMax>=5,json.get(SpellSlots,"5")>0),"5th Level,","")
			+if(and(pm.SpellLevelMin<=6,pm.SpellLevelMax>=6,json.get(SpellSlots,"6")>0),"6th Level,","")
			+if(and(pm.SpellLevelMin<=7,pm.SpellLevelMax>=7,json.get(SpellSlots,"7")>0),"7th Level,","")
			+if(and(pm.SpellLevelMin<=8,pm.SpellLevelMax>=8,json.get(SpellSlots,"8")>0),"8th Level,","")
			+if(and(pm.SpellLevelMin<=9,pm.SpellLevelMax>=9,json.get(SpellSlots,"9")>0),"9th Level,","")
			+if(and(pm.SpellLevelMin<=WSpellLevel,pm.SpellLevelMax>=WSpellLevel,json.get(SpellSlots,"W")>0),"Warlock Spell,","")))
		)]
		[h:pm.ResourceChoice = pm.ResourceName]
		[h:disResourceChoiceMsg=if(or(pm.ResourceUsed==pm.ResourceUsedMax,pm.ResourceChoiceMsg==""),"","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
		[h:disResourceChoice = if(disResourceOptions=="","","pm.ResourceChoice | "+disResourceOptions+" | Choose "+if(pm.SpellOption==3,"to use "+pm.ResourceName+" or ","")+"a Spell Level | LIST | VALUE=STRING ")]
		[h:abort(input(
			disResourceChoiceMsg,
			disResourceChoice))]
		[h:UseSpellSlotTest=if(pm.ResourceChoice == pm.ResourceName,0,1)]
	}]
}]

[h:pm.ResourceChoice=if(pm.ResourceChoice=="Cancel",0,number(pm.ResourceChoice))]

[h,if(UseSpellSlotTest==1),CODE:{
	[h:sLevelSelect = number(substring(pm.ResourceChoice,0,1))]
	[h,if(pm.ResourceChoice=="0"),CODE:{};{
		[h:SpellSlots=if(pm.ResourceUsed==0,SpellSlots,json.set(SpellSlots,sLevelSelect+"",json.get(SpellSlots,sLevelSelect+"")-1))]
	}]
	[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Spell Slots Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+pm.SpellSlots()+"</span></b>","RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",sLevelSelect,"Units",1)]
};{
	[h,if(BackupTest),CODE:{
		[h:pm.ResourceAmount = pm.BackupResourceAmount]
		[h:pm.ResourceMax = pm.BackupResourceMax]
		[h:pm.ResourceVarName = pm.BackupResource]
		[h:pm.ResourceName = pm.BackupResource]
		[h:pm.ResourceRestoration=pm.BackupResourceRestoration]
	};{}]
	[h:pm.ResourceUsed = number(pm.ResourceUsed)]
	[h:pm.ResourceEnough = if(pm.ResourceAmount-pm.ResourceUsed<0,0,1)]
	[h,if(pm.ResourceKey==""):pm.ResourceFinal=(pm.ResourceAmount-pm.ResourceUsed);pm.ResourceFinal=json.set(json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+pm.ResourceVarName+"' && @.IsActive>0 && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['Resource']"),0),pm.ResourceKey,(pm.ResourceAmount-pm.ResourceUsed))]
	[h,if(pm.ResourceEnough),CODE:{
		[h:setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.IsActive>0)]['Resource']",pm.ResourceFinal))]
		[h:macro.return = json.set("","ShowIfCondensed",1,"Header",pm.ResourceName+" Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+(pm.ResourceAmount-pm.ResourceUsed)+"/"+pm.ResourceMax+"</span></b>"+pm.ResourceRestoration,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.ResourceUsed,"Units",1)]
	};{
		[h:macro.return = json.set("","ShowIfCondensed",1,"Header",pm.ResourceName+" Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+pm.ResourceAmount+"/"+pm.ResourceMax+"</span></b>"+pm.ResourceRestoration,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",0,"Units",0)]
	}]
}]