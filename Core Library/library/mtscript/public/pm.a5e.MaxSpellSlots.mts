[h:maxSpellLevel = 9]
[h:SpellSlotDisplay = ""]
[h,count(maxSpellLevel),CODE:{
	[h,switch(roll.count):
		case 0: SpellSlotDisplay = if(json.get(MaxSpellSlots,"1")>0,listAppend(SpellSlotDisplay,"1st: "+json.get(MaxSpellSlots,"1")," | "),SpellSlotDisplay);
		case 1: SpellSlotDisplay = if(json.get(MaxSpellSlots,"2")>0,listAppend(SpellSlotDisplay,"2nd: "+json.get(MaxSpellSlots,"2")," | "),SpellSlotDisplay);
		case 2: SpellSlotDisplay = if(json.get(MaxSpellSlots,"3")>0,listAppend(SpellSlotDisplay,"3rd: "+json.get(MaxSpellSlots,"3")," | "),SpellSlotDisplay);
		default: SpellSlotDisplay = if(json.get(MaxSpellSlots,(roll.count+1)+"")>0,listAppend(SpellSlotDisplay,(roll.count+1)+"th: "+json.get(MaxSpellSlots,(roll.count+1)+"")," | "),SpellSlotDisplay)
	]
}]

[h:unsharedSpellSlots = json.path.read(allAbilities,"[*][?(@.ResourceAsSpellSlot==1)]")]
[h,foreach(feature,unsharedSpellSlots),CODE:{
	[h:multiResourceTest = json.type(json.get(feature,"Resource"))=="OBJECT"]
	[h,if(multiResourceTest),CODE:{
		[h:tempResources = evalMacro(json.get(feature,"ResourceMax"))]
		[h,foreach(resource,json.fields(tempResources)): SpellSlotDisplay = listAppend(SpellSlotDisplay,resource+": "+json.get(tempResources,resource)," | ")]
	};{
		[h:tempResourceName = if(json.get(feature,"ResourceDisplayName")=="",json.get(feature,"DisplayName"),json.get(feature,"ResourceDisplayName"))]
		[h:SpellSlotDisplay = listAppend(SpellSlotDisplay,tempResourceName+": "+json.get(feature,"ResourceMax")," | ")]
	}]
}]

[h:macro.return = SpellSlotDisplay]