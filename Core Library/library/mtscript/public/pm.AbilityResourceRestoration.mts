[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.ResourceName=arg(1)]
[h:pm.ResourceVarName=arg(2)]

[h:pm.ResourceType=json.type(arg(3))]
[h,if(pm.ResourceType=="OBJECT"),CODE:{
	[h:pm.ResourceGained = if(pm.Tooltip,0,json.get(arg(3),"Amount"))]
	[h:pm.ResourceGainedMax = json.get(arg(3),"Max")]
	[h:pm.SpellLevelMin=if(json.get(arg(3),"SpellLevelMin")=="",1,json.get(arg(3),"SpellLevelMin"))]
	[h:pm.SpellLevelMax=if(json.get(arg(3),"SpellLevelMax")=="",99,json.get(arg(3),"SpellLevelMax"))]
	[h:pm.BackupResource=json.get(arg(3),"BackupResource")]
	[h:pm.ResourceChoiceMsg=json.get(arg(3),"ChoiceMsg")]
	[h:BackupTest=0]
	[h:pm.ResourceKey=json.get(arg(3),"ResourceKey")]
	[h:pm.ModularSpells=if(json.get(arg(3),"Modular")=="",0,json.get(arg(3),"Modular"))]
};{
	[h:pm.SpellLevelMin=1]
	[h:pm.SpellLevelMax=99]
	[h:pm.BackupResource=""]
	[h:pm.ResourceChoiceMsg=""]
	[h:BackupTest=0]
	[h:pm.ResourceGained=if(pm.Tooltip,0,arg(3))]
	[h:pm.ResourceKey=""]
	[h:pm.ResourceGainedMax=pm.ResourceGained]
	[h:pm.ModularSpells=0]
}]

[h:"<!-- If it restores anything other than a spell slot, it just restores it via using pm.AbilityResources with a negative value. Otherwise, it goes through this abomination. -->"]
	[h:"<!-- First it ensures that pm.ResourceGained was actually set, since Modular makes setting Amount unnecessary and it needs to be an object for json.merge to function. -->"]
	[h:"<!-- Merges an object that adds no spells with the one that does add spells so that there are no errors when adding spells at the end. -->"]
	[h:"<!-- Establishes ChosenSlots variable to be used to check if the correct number of slots have been chosen in Modular restoration abilities. -->"]
	[h:"<!-- Builds input by looping through levels 1-9, and also checking how many slots are missing at each level to prevent unnecessary spending. -->"]
	[h:"<!-- Next step: get a good way to include Warlock spells in the list. Also, add a non-modular method of selecting a spell level. Then should be done! -->"]

[h,if(pm.ResourceVarName=="Spell Slots"),CODE:{
	[h:"<!-- THIS DOESN'T WORK TO RESTORE TO MAX (MERGING WILL ERROR OUT) OR TO RESTORE A SPELL THAT YOU CAN CHOOSE THE LEVEL OF (NEED AMOUNT FOR NUMBER OF SPELLS TO REGAIN). MIGHT NEED A SEPARATE THING FOR 'AMOUNT' AND THE OBJ HOLDING EACH SPELL LEVEL RESTORED. IDK. -->"]
	[h:pm.AddedSpells = json.set("","1",0,"2",0,"3",0,"4",0,"5",0,"6",0,"7",0,"8",0,"9",0,"W",0)]
	[h:disSpellLevelOptions=""]
	[h:pm.TempSlotsCount=1]
	[h,count(9),CODE:{
		[h:pm.SpellSlotsMissing = json.get(getProperty("a5e.stat.MaxSpellSlots"),""+pm.TempSlotsCount)-json.get(getProperty("a5e.stat.SpellSlots"),""+pm.TempSlotsCount)]
		[h:disSpellSlotOptions="0"]
		[h,count(pm.SpellSlotsMissing): disSpellSlotOptions=listAppend(disSpellSlotOptions,""+(roll.count+1),",")]
		[h:set("pm.Level"+pm.TempSlotsCount+"Spell",0)]
		[h:disSpellLevelOptions=if(and(pm.SpellLevelMin<=pm.TempSlotsCount,pm.SpellLevelMax>=pm.TempSlotsCount,json.get(getProperty("a5e.stat.MaxSpellSlots"),pm.TempSlotsCount)>0),listAppend(disSpellLevelOptions," pm.Level"+pm.TempSlotsCount+"Spell | "+disSpellSlotOptions+" | Level "+pm.TempSlotsCount+" | LIST ","##"),disSpellLevelOptions)]
		[h:pm.TempSlotsCount=pm.TempSlotsCount+1]
	}]
	[h:pm.LevelWSpell = 0]
	[h:disSpellLevelOptions=if(and(pm.SpellLevelMin<=WSpellLevel,pm.SpellLevelMax>=WSpellLevel,WSpellLevel>0),listAppend(disSpellLevelOptions," pm.LevelWSpell | "+disSpellSlotOptions+" | Warlock Spell | LIST ","##"),disSpellLevelOptions)]
	[h:pm.ChosenSlots=9999999]
	[h,while(and(pm.ChosenSlots>pm.ModularSpells,pm.ModularSpells!=0)),CODE:{
		[h:abort(input(
			" junkVar | Select spell slots of a combined |  | LABEL | SPAN=TRUE ",
			" junkVar | level less than or equal to "+pm.ModularSpells+" |  | LABEL | SPAN=TRUE ",
			" junkVar | --------------------------------------------- |  | LABEL | SPAN=TRUE ",
			disSpellLevelOptions
			))]
		[h:pm.ChosenSlots = pm.Level1Spell+(pm.Level2Spell*2)+(pm.Level3Spell*3)+(pm.Level4Spell*4)+(pm.Level5Spell*5)+(pm.Level6Spell*6)+(pm.Level7Spell*7)+(pm.Level8Spell*8)+(pm.Level9Spell*9)+(pm.LevelWSpell*WSpellLevel)]
		[h:pm.AddedSpells = json.set("","1",pm.Level1Spell,"2",pm.Level2Spell,"3",pm.Level3Spell,"4",pm.Level4Spell,"5",pm.Level5Spell,"6",pm.Level6Spell,"7",pm.Level7Spell,"8",pm.Level8Spell,"9",pm.Level9Spell,"W",pm.LevelWSpell)]
	}]
	[h,if(json.type(pm.ResourceGained)=="OBJECT" && pm.ModularSpells==0),CODE:{
		[h:pm.AddedSpells = json.merge(pm.AddedSpells,pm.ResourceGained)]
	};{}]
	
	[h,if(json.type(pm.ResourceGained)=="UNKNOWN" && isNumber(pm.ResourceGained) && pm.ModularSpells==0),CODE:{
		[h:LevelOptions=
		if(and(pm.SpellLevelMin<=1,pm.SpellLevelMax>=1,json.get(getProperty("a5e.stat.SpellSlots"),"1")>0),"1st Level,","")
		+if(and(pm.SpellLevelMin<=2,pm.SpellLevelMax>=2,json.get(getProperty("a5e.stat.SpellSlots"),"2")>0),"2nd Level,","")
		+if(and(pm.SpellLevelMin<=3,pm.SpellLevelMax>=3,json.get(getProperty("a5e.stat.SpellSlots"),"3")>0),"3rd Level,","")
		+if(and(pm.SpellLevelMin<=4,pm.SpellLevelMax>=4,json.get(getProperty("a5e.stat.SpellSlots"),"4")>0),"4th Level,","")
		+if(and(pm.SpellLevelMin<=5,pm.SpellLevelMax>=5,json.get(getProperty("a5e.stat.SpellSlots"),"5")>0),"5th Level,","")
		+if(and(pm.SpellLevelMin<=6,pm.SpellLevelMax>=6,json.get(getProperty("a5e.stat.SpellSlots"),"6")>0),"6th Level,","")
		+if(and(pm.SpellLevelMin<=7,pm.SpellLevelMax>=7,json.get(getProperty("a5e.stat.SpellSlots"),"7")>0),"7th Level,","")
		+if(and(pm.SpellLevelMin<=8,pm.SpellLevelMax>=8,json.get(getProperty("a5e.stat.SpellSlots"),"8")>0),"8th Level,","")
		+if(and(pm.SpellLevelMin<=9,pm.SpellLevelMax>=9,json.get(getProperty("a5e.stat.SpellSlots"),"9")>0),"9th Level,","")
		+if(and(pm.SpellLevelMin<=WSpellLevel,pm.SpellLevelMax>=WSpellLevel,json.get(getProperty("a5e.stat.SpellSlots"),"W")>0),"Warlock Spell,","")]

		[h:pm.dAbilityInfo=if(pm.ResourceGained==0,"","junk| <html><span style='align:center'>"+pm.Ability+"</span></html> | |LABEL|SPAN=TRUE")]
		[h:disResourceChoiceMsg=if(or(pm.ResourceGained==pm.ResourceGainedMax,pm.ResourceChoiceMsg==""),"","junkVar | Choose a spell level to gain "+pm.ResourceGained+" slots |  | LABEL | SPAN=TRUE ")]
		[h:pm.dLevelSel=if(pm.ResourceGained==0,"",
		"pm.ResourceChoice|"+LevelOptions+"|Choose Spell Level Gained|LIST| VALUE=STRING")]
		[h:pm.ResourceChoice="0"]
	
		[h:abort(input(
		""+pm.dAbilityInfo+"",
		disResourceChoiceMsg,
		""+pm.dLevelSel+""))]
		
		[h:pm.AddedSpells = json.merge(pm.AddedSpells,json.set("",substring(pm.ResourceChoice,0,1),pm.ResourceGained))]
	};{}]
	
	[h:a5e.stat.SpellSlots = if(pm.ResourceGained=="Max",getProperty("a5e.stat.MaxSpellSlots"),json.set(getProperty("a5e.stat.MaxSpellSlots"),"1",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"1"),json.get(getProperty("a5e.stat.SpellSlots"),"1")+json.get(pm.AddedSpells,"1")),"2",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"2"),json.get(getProperty("a5e.stat.SpellSlots"),"2")+json.get(pm.AddedSpells,"2")),"3",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"3"),json.get(getProperty("a5e.stat.SpellSlots"),"3")+json.get(pm.AddedSpells,"3")),"4",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"4"),json.get(getProperty("a5e.stat.SpellSlots"),"4")+json.get(pm.AddedSpells,"4")),"5",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"5"),json.get(getProperty("a5e.stat.SpellSlots"),"5")+json.get(pm.AddedSpells,"5")),"6",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"6"),json.get(getProperty("a5e.stat.SpellSlots"),"6")+json.get(pm.AddedSpells,"6")),"7",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"7"),json.get(getProperty("a5e.stat.SpellSlots"),"7")+json.get(pm.AddedSpells,"7")),"8",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"8"),json.get(getProperty("a5e.stat.SpellSlots"),"8")+json.get(pm.AddedSpells,"8")),"9",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"9"),json.get(getProperty("a5e.stat.SpellSlots"),"9")+json.get(pm.AddedSpells,"9")),"W",min(json.get(getProperty("a5e.stat.MaxSpellSlots"),"W"),json.get(getProperty("a5e.stat.SpellSlots"),"W")+json.get(pm.AddedSpells,"W"))))]
	[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Spell Slots Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+pm.SpellSlots()+"</span></b>","RollContents","","DisplayOrder","['Rules','Roll','Full']","Value","","Units","")]
};{
	[h,if(pm.ResourceKey!=""),CODE:{
		[h:pm.ResourceAmount = json.get(json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && @.Subclass=='"+pm.Subclass+"')]['Resource']"),0),pm.ResourceKey)]
		[h:pm.MaxResourceBase = json.get(json.get(json.evaluate(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && @.Subclass=='"+pm.Subclass+"')]['MaxResource']")),0),pm.ResourceKey)]
	};{
		[h:pm.ResourceAmount = math.arraySum(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['Resource']"))]
		[h:pm.MaxResourceBase = math.arraySum(json.evaluate(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.Name=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['MaxResource']")))]
	}]

	[h:miMaxResourceBonus=json.path.read(MagicItemClassBonuses,"[?(@.IsActive>0 && @.Ability=='"+pm.ResourceVarName+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.MaxResourceBonus!=0)]['MaxResourceBonus']")]
	[h,if(json.isEmpty(miMaxResourceBonus)): miMaxResourceBonusFinal = 0 ; miMaxResourceBonusFinal = math.arraySum(miMaxResourceBonus)]
	[h:pm.ResourceMax=miMaxResourceBonusFinal+pm.MaxResourceBase]

	[h,if(pm.Ability == pm.ResourceVarName),CODE:{};{
		[h:miMaxResourceBonus=json.path.read(MagicItemClassBonuses,"[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.MaxResourceBonus!=0)]['MaxResourceBonus']")]
		[h,if(json.isEmpty(miMaxResourceBonus)): miMaxResourceBonusFinal = 0 ; miMaxResourceBonusFinal = math.arraySum(miMaxResourceBonus)]
		[h:pm.ResourceMax=miMaxResourceBonusFinal+pm.ResourceMax]
	}]
	[h:pm.ResourceGained = if(pm.ResourceGained=="Max",pm.ResourceMax,pm.ResourceGained)]

	[h,if(pm.ResourceKey==""):pm.ResourceFinal=min(pm.ResourceAmount+pm.ResourceGained,pm.ResourceMax);json.set(json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+pm.ResourceVarName+"' && @.IsActive>0 && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['Resource']"),0),pm.ResourceKey,min(pm.ResourceAmount+pm.ResourceGained,pm.ResourceMax))]
	
	[h:setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+pm.ResourceVarName+"' && @.IsActive>0 && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['Resource']",pm.ResourceFinal))]
	[h:macro.return = json.set("","ShowIfCondensed",1,"Header",pm.ResourceName+" Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+pm.ResourceFinal+"/"+pm.ResourceMax+"</span></b>","RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.ResourceFinal-pm.ResourceAmount,"Units",1)]
}]