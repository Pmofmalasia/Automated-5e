[h:maxSpellLevel = 9]
[h:SpellSlotDisplay = ""]
[h,count(maxSpellLevel),CODE:{
	[h,switch(roll.count):
		case 0: SpellSlotDisplay = if(json.get(getProperty("a5e.stat.MaxSpellSlots"),"1")>0,listAppend(SpellSlotDisplay,"1st: "+json.get(getProperty("a5e.stat.SpellSlots"),"1")," | "),SpellSlotDisplay);
		case 1: SpellSlotDisplay = if(json.get(getProperty("a5e.stat.MaxSpellSlots"),"2")>0,listAppend(SpellSlotDisplay,"2nd: "+json.get(getProperty("a5e.stat.SpellSlots"),"2")," | "),SpellSlotDisplay);
		case 2: SpellSlotDisplay = if(json.get(getProperty("a5e.stat.MaxSpellSlots"),"3")>0,listAppend(SpellSlotDisplay,"3rd: "+json.get(getProperty("a5e.stat.SpellSlots"),"3")," | "),SpellSlotDisplay);
		default: SpellSlotDisplay = if(json.get(getProperty("a5e.stat.MaxSpellSlots"),(roll.count+1)+"")>0,listAppend(SpellSlotDisplay,(roll.count+1)+"th: "+json.get(getProperty("a5e.stat.SpellSlots"),(roll.count+1)+"")," | "),SpellSlotDisplay)
	]
}]

[h:unsharedSpellSlots = json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?(@.ResourceAsSpellSlot==1)]")]
[h,foreach(feature,unsharedSpellSlots),CODE:{
	[h:multiResourceTest = json.type(json.get(feature,"Resource"))=="OBJECT"]
	[h,if(multiResourceTest),CODE:{
		[h:tempResources = json.get(feature,"Resource")]
		[h,foreach(resource,json.fields(tempResources)): SpellSlotDisplay = listAppend(SpellSlotDisplay,resource+": "+json.get(json.get(feature,"Resource"),resource)," | ")]
	};{
		[h:tempResourceName = if(json.get(feature,"ResourceDisplayName")=="",json.get(feature,"DisplayName"),json.get(feature,"ResourceDisplayName"))]
		[h:SpellSlotDisplay = listAppend(SpellSlotDisplay,tempResourceName+": "+json.get(feature,"Resource")," | ")]
	}]
}]

[h:macro.return = SpellSlotDisplay]