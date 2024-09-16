[h,if(argCount()>0): switchToken(arg(0))]
[h:ParentToken = currentToken()]

[h:maxSpellLevel = 9]
[h:SpellSlotDisplay = ""]
[h,count(maxSpellLevel),CODE:{
	[h,switch(roll.count):
		case 0: SpellSlotDisplay = if(json.get(getProperty("a5e.stat.MaxSpellSlots"),"1")>0,listAppend(SpellSlotDisplay,"1st: "+json.get(getProperty("a5e.stat.MaxSpellSlots"),"1")," | "),SpellSlotDisplay);
		case 1: SpellSlotDisplay = if(json.get(getProperty("a5e.stat.MaxSpellSlots"),"2")>0,listAppend(SpellSlotDisplay,"2nd: "+json.get(getProperty("a5e.stat.MaxSpellSlots"),"2")," | "),SpellSlotDisplay);
		case 2: SpellSlotDisplay = if(json.get(getProperty("a5e.stat.MaxSpellSlots"),"3")>0,listAppend(SpellSlotDisplay,"3rd: "+json.get(getProperty("a5e.stat.MaxSpellSlots"),"3")," | "),SpellSlotDisplay);
		default: SpellSlotDisplay = if(json.get(getProperty("a5e.stat.MaxSpellSlots"),(roll.count+1)+"")>0,listAppend(SpellSlotDisplay,(roll.count+1)+"th: "+json.get(getProperty("a5e.stat.MaxSpellSlots"),(roll.count+1)+"")," | "),SpellSlotDisplay)
	]
}]

[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:featureSpellSlots = js.a5e.GetFeatureSpellSlots(a5e.UnifiedAbilities,ParentToken)]
[h,foreach(slot,featureSpellSlots): SpellSlotDisplay = listAppend(SpellSlotDisplay,json.get(slot,"DisplayName")+": "+json.get(slot,"MaxResource")," | ")]

[h:return(0,SpellSlotDisplay)]