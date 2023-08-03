[h:ab.ResourceInfo = arg(0)]
[h:ab.ResourceType = arg(1)]
[h:ab.MultiResourceTest = if(ab.ResourceType == "Multiple Resources",1,0)]
[h:ab.ContinueLoopTest = 1]
[h:ab.ResourceFinal = if(ab.MultiResourceTest,"[r:json.set(''","[r:")]
[h:ab.AllDisplayNames = ""]

[h:ab.Level = json.get(ab.ResourceInfo,"Level")]
[h:ab.UpdateLevelOptions = string(ab.Level)]
[h:ab.UpdateTest = 0]
[h,count(20-ab.Level),CODE:{
	[h:ab.UpdateLevelOptions = listAppend(ab.UpdateLevelOptions,ab.Level+roll.count+1)]
	[h:set("ab.UpdateLevel"+(ab.Level+roll.count+1),if(ab.MultiResourceTest,"[r:json.set(''","[r:"))]
}]

[h:"<!-- TODO: Might be nice to have an option to have the name of the resource be equivalent to a choice made (usually a spell afaik) for display purposes. -->"]

[h,while(ab.ContinueLoopTest==1),CODE:{
	[h,if(ab.MultiResourceTest == 1),CODE:{
		[h:abort(input(
			" ab.ResourceDisplayName | -- Name Here -- | Enter name for this resource ",
			" ab.ResourceType | 1,Other Flat Number,Attribute Based,Linearly Class Level Based,Non-Linearly Class Level Based,Proficiency Based,Custom | Amount of Resource | LIST | VALUE=STRING ",
			" ab.ResourceLevelGained | "+ab.UpdateLevelOptions+" | Level When Resource is Gained | LIST | VALUE=STRING ",
			" ab.ResourceDone |  | Finish adding new resources | CHECK "
		))]
		[h:ab.MultiResourceTest = 1]
		[h:ab.ResourceName = pm.RemoveSpecial(ab.ResourceDisplayName)]
		[h:ab.AllDisplayNames = json.set(ab.AllDisplayNames,ab.ResourceName,ab.ResourceDisplayName)]
		[h:ab.ResourceFinal = if(ab.ResourceLevelGained == ab.Level,ab.ResourceFinal+",'"+ab.ResourceName+"',",ab.ResourceFinal)]
		[h,foreach(tempLevel,listDelete(ab.UpdateLevelOptions,0)): set("ab.UpdateLevel"+tempLevel,if(tempLevel>=ab.ResourceLevelGained,eval("ab.UpdateLevel"+tempLevel)+",'"+ab.ResourceName+"',",eval("ab.UpdateLevel"+tempLevel)))]
		[h:ab.ContinueLoopTest = !ab.ResourceDone]
		[h:ab.UpdateTest = max(ab.UpdateTest,if(or(ab.ResourceType == "Non-Linearly Class Level Based",ab.ResourceLevelGained != ab.Level),1,0))]
	};{
		[h:ab.AllDisplayNames = ""]
		[h:ab.ResourceLevelGained = ab.Level]
		[h:ab.UpdateTest = if(ab.ResourceType == "Non-Linearly Class Level Based",1,0)]
		[h:ab.ContinueLoopTest = 0]
	}]
	
	[h,switch(ab.ResourceType),CODE:
		case "1": {[h:ab.SecondResourceDisplay = ""]};
		case "Other Flat Number": {[h:ab.SecondResourceDisplay = " ab.ResourceChoice | 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 | Amount of Resource | LIST | VALUE=STRING"]};
		case "Attribute Based": {[h:ab.SecondResourceDisplay = " ab.ResourceChoice | "+pm.GetAttributes("DisplayName")+" | Choose Attribute | LIST | VALUE=STRING ## ab.MultiplierChoice | 1/4,1/3,1/2,1,2,3,4,5,6,7,8,9,10 | Resource = Attribute x | LIST | VALUE=STRING SELECT=3"]};
		case "Linearly Class Level Based": {[h:ab.SecondResourceDisplay = " ab.ResourceChoice | 1/4,1/3,1/2,1,2,3,4,5,6,7,8,9,10 | Resource = Class Level x | LIST | VALUE=STRING SELECT=3"]};
		case "Non-Linearly Class Level Based": {
				[h:ab.SecondResourceDisplay = " junkVar | <html><span title='e.g. Rage has 2 per long rest at level 1 and 2, and 3 at level 3. 2 is input at level 1, 0 for level 2, and 1 for level 3.'>Input the amount of maximum resource <i>gained</i> at each level</span></html> | | LABEL | SPAN=TRUE "]
				[h,foreach(tempLevel,ab.UpdateLevelOptions): ab.SecondResourceDisplay = listAppend(ab.SecondResourceDisplay," tempResource"+tempLevel+" | 0,1,2,3,4,5,6,7,8,9,10 | Level "+tempLevel+" | LIST | VALUE=STRING ","##")]
			};
		case "Proficiency Based": {[h:ab.SecondResourceDisplay = " ab.ResourceChoice | 1/2,1,2,3,4,5,6,7,8,9,10 | Resource = Proficiency x | LIST | VALUE=STRING SELECT=1"]};
		case "Custom": {[h:ab.SecondResourceDisplay = " ab.ResourceChoice |  | <html><span title='Do not include the roll option, and only use double quotes. This will likely require advanced knowledge of how the code works. If you have just now realized that youre in over your head, just type a number instead.'>Type a function to calculate the amount of resource.</span></html>"]}
	]

	[h:abort(input(ab.SecondResourceDisplay))]

	[h,switch(ab.ResourceType),CODE:
		case "1": {[h:tempResource = 1]};
		case "Attribute Based": {[h:tempResource = "max(1,json.get(getProperty('a5e.stat.AtrMods'),'"+pm.RemoveSpecial(ab.ResourceChoice)+"')"+if(ab.MultiplierChoice=="1","","*"+ab.MultiplierChoice)+")"]};
		case "Other Flat Number": {[h:tempResource = ab.ResourceChoice]};
		case "Linearly Class Level Based": {[h:tempResource = "floor(pm.GetAbilityLevel(json.set('','Name','"+json.get(ab.ResourceInfo,"Name")+"','Class','"+json.get(ab.ResourceInfo,"Class")+"','Subclass','"+json.get(ab.ResourceInfo,"Subclass")+"'))*"+ab.ResourceChoice+")"]};
		case "Non-Linearly Class Level Based":{[h:tempResource = eval("tempResource"+ab.Level)]};
		case "Proficiency Based": {[h:tempResource = "getProperty('a5e.stat.Proficiency')*"+ab.ResourceChoice]};
		case "Custom": {[h:tempResource = ab.ResourceChoice]};
		default: {}
	]

	[h:ab.ResourceFinal = if(ab.ResourceLevelGained == ab.Level,ab.ResourceFinal+tempResource,ab.ResourceFinal)]

	[h,if(ab.ResourceType != "Non-Linearly Class Level Based"),CODE:{
		[h:tempLevelsListForCodeLevelPurposes = ""]
		[h:tempCumulativeResource = 0]
		[h,foreach(tempLevel,listDelete(ab.UpdateLevelOptions,0)): set("ab.UpdateLevel"+tempLevel,if(tempLevel>=ab.ResourceLevelGained,eval("ab.UpdateLevel"+tempLevel)+tempResource,eval("ab.UpdateLevel"+tempLevel)))]
	};{
		[h:tempLevelsListForCodeLevelPurposes = listDelete(ab.UpdateLevelOptions,0)]
		[h:tempCumulativeResource = eval("tempResource"+ab.Level)]
	}]

	[h,foreach(tempLevel,tempLevelsListForCodeLevelPurposes),CODE:{
		[h:tempCumulativeResource = tempCumulativeResource+eval("tempResource"+tempLevel)]
		[h:set("ab.UpdateLevel"+tempLevel,if(tempLevel>=ab.ResourceLevelGained,eval("ab.UpdateLevel"+tempLevel)+tempCumulativeResource,eval("ab.UpdateLevel"+tempLevel)))]
	}]
}]

[h:ab.ResourceFinal = ab.ResourceFinal+if(ab.MultiResourceTest,")","")+"]"]

[h,foreach(tempLevel,listDelete(ab.UpdateLevelOptions,0)): set("ab.UpdateLevel"+tempLevel,eval("ab.UpdateLevel"+tempLevel)+if(ab.MultiResourceTest,")","")+"]")]

[h:ab.ResourceUpdates = ""]
[h,if(ab.UpdateTest),CODE:{
	[h,foreach(tempLevel,listDelete(ab.UpdateLevelOptions,0)),CODE:{
		[h,if((tempLevel - 1) == ab.Level):
			ab.ResourceUpdates = if(eval("ab.UpdateLevel"+tempLevel) == ab.ResourceFinal,ab.ResourceUpdates,json.set(ab.ResourceUpdates,tempLevel,eval("ab.UpdateLevel"+tempLevel)));
			ab.ResourceUpdates = if(eval("ab.UpdateLevel"+tempLevel) == eval("ab.UpdateLevel"+(tempLevel-1)),ab.ResourceUpdates,json.set(ab.ResourceUpdates,tempLevel,eval("ab.UpdateLevel"+tempLevel)))
		]
	}]
};{
	[h:ab.ResourceUpdates = ""]
}]

[h:"<!-- Prevents features that don't gain a multiresource until future levels from causing errors -->"]
[h,if(ab.ResourceFinal == "[r:json.set('')]"): ab.ResourceFinal = ""]
[h:macro.return = json.set("","Base",ab.ResourceFinal,"Updates",ab.ResourceUpdates,"DisplayName",ab.AllDisplayNames)]