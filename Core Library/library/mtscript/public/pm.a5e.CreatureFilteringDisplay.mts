[h:creatureFilteringData = arg(0)]

[h,if(json.get(creatureFilteringData,"Allegiance") ==""):
	targetAllegiance = "{}";
	json.get(creatureFilteringData,"Allegiance")
]
[h:targetSize = json.get(creatureFilteringData,"Size")]
[h:targetSizeMax = json.get(creatureFilteringData,"SizeMax")]
[h:targetSizeMin = json.get(creatureFilteringData,"SizeMin")]
[h:targetTypeInclusive = json.get(creatureFilteringData,"TypeInclusive")]
[h:targetSubtypeInclusive = json.get(creatureFilteringData,"SubtypeInclusive")]
[h:targetCreatureNameInclusive = json.get(creatureFilteringData,"CreatureNameInclusive")]
[h:targetTypeExclusive = json.get(creatureFilteringData,"TypeExclusive")]
[h:targetSubtypeExclusive = json.get(creatureFilteringData,"SubtypeExclusive")]
[h:targetCreatureNameExclusive = json.get(creatureFilteringData,"CreatureNameExclusive")]
[h:targetSight = if(json.get(creatureFilteringData,"Sight")=="",0,json.get(creatureFilteringData,"Sight"))]
[h:targetHearing = if(json.get(creatureFilteringData,"Hearing")=="",0,json.get(creatureFilteringData,"Hearing"))]
[h:targetUnderstand = if(json.get(creatureFilteringData,"Understand")=="",0,json.get(creatureFilteringData,"Understand"))]
[h:targetIntMin = if(json.get(creatureFilteringData,"IntMin")=="",0,json.get(creatureFilteringData,"IntMin"))]
[h:targetIntMax = if(json.get(creatureFilteringData,"IntMax")=="",999999,json.get(creatureFilteringData,"IntMax"))]

[h,if(json.get(targetAllegiance,"Any") == 1 || json.isEmpty(targetAllegiance)),CODE:{
	[h:allegianceDisplay = ""]
};{
	[h:notSelf_Neutral_Ally_Foe = (json.get(targetAllegiance,"NotSelf") == 1)+""+(json.get(targetAllegiance,"Neutral") == 1)+" "+(json.get(targetAllegiance,"Ally") == 1)+""+(json.get(targetAllegiance,"Foe") == 1)]
	[h,switch(notSelf_Neutral_Ally_Foe):
		case "10 00": allegianceDisplay = "Other";
		case "11 00": allegianceDisplay = "Neutral";
		case "11 10": allegianceDisplay = "Other Nonhostile";
		case "11 11": allegianceDisplay = "";
		case "11 01": allegianceDisplay = "Non-Allied";
		case "10 01": allegianceDisplay = "Hostile";
		case "10 10": allegianceDisplay = "Other Allied";
		case "10 11": allegianceDisplay = "Other Non-Neutral";
		case "00 00": allegianceDisplay = "";
		case "01 00": allegianceDisplay = "Neutral";
		case "01 10": allegianceDisplay = "Nonhostile";
		case "01 11": allegianceDisplay = "";
		case "01 01": allegianceDisplay = "Non-Allied";
		case "00 01": allegianceDisplay = "Hostile";
		case "00 10": allegianceDisplay = "Allied";
		case "00 11": allegianceDisplay = "Non-Neutral";
		default: allegianceDisplay = "Self Only"
	]
}]

[h:"<!-- TODO: Add size limits to the display -->"]

[h:"<!-- TODO: Creature name limits are not included in the display, keep as is? -->"]
[h:inclusiveTypeDisplay = pm.a5e.TypeFilteringDisplay(targetTypeInclusive,1)]
[h:inclusiveSubtypeDisplay = pm.a5e.TypeFilteringDisplay(targetSubtypeInclusive,1)]
[h:exclusiveTypeDisplay = pm.a5e.TypeFilteringDisplay(targetTypeExclusive,0)]
[h:exclusiveSubtypeDisplay = pm.a5e.TypeFilteringDisplay(targetSubtypeExclusive,0)]

[h:finalDisplay = allegianceDisplay]
[h,if(inclusiveTypeDisplay != ""): finalDisplay = listAppend(finalDisplay,inclusiveTypeDisplay,", ")]
[h,if(inclusiveSubtypeDisplay != ""): finalDisplay = listAppend(finalDisplay,inclusiveSubtypeDisplay,", ")]
[h,if(exclusiveTypeDisplay != ""): finalDisplay = listAppend(finalDisplay,exclusiveTypeDisplay,", ")]
[h,if(exclusiveSubtypeDisplay != ""): finalDisplay = listAppend(finalDisplay,exclusiveSubtypeDisplay,", ")]

[h,if(finalDisplay == ""): finalDisplay = "Any"]
[h,if(allegianceDisplay != "Self Only "): finalDisplay = finalDisplay + " Creature"]

[h:return(0,finalDisplay)]