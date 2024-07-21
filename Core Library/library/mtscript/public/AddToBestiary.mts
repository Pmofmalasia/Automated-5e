[h:BestiaryTokens = macro.args]

[h,MACRO("TokenToJSON@Lib:pm.a5e.Core"): BestiaryTokens]
[h:newBestiaryEntries = macro.return]

[h:allSourcebooks = pm.GetBookInfo()]
[h:sourcebookOptions = json.path.read(allSourcebooks,"\$[*]['DisplayName']")]

[h:abort(input(
	" sourcebookChoice | "+sourcebookOptions+" | Add Creatures to Which Sourcebook | LIST | DELIMITER=JSON "
))]
[h:sourcebookData = json.get(allSourcebooks,sourcebookChoice)]
[h:Library = json.get(sourcebookData,"Library")]
[h:sourcebookName = json.get(sourcebookData,"DisplayName")]
[h:newEntryNames = json.path.read(newBestiaryEntries,"\$[*]['Name']")]

[h:mapExists = json.contains(getAllMapNames("json"),"z.1 Bestiary")]
[h,if(!mapExists): createMap("z.1 Bestiary")]

[h:oldBestiary = getLibProperty("sb.Bestiary","Lib:"+Library)]
[h,if(json.isEmpty(oldBestiary)): oldBestiary = "[]"]
[h:repeatEntryTest = json.path.read(oldBestiary,"\$[*][?(@.Name in "+newEntryNames+")]")]
[h:replacedTokens = "{}"]
[h,if(!json.isEmpty(repeatEntryTest)),CODE:{
	[h:replaceChoicesInput = " junkVar | Duplicate Entries Noted. Choose An Option for Each: |  | LABEL | SPAN=TRUE "]

	[h:safeCounter = 0]
	[h,foreach(creature,repeatEntryTest),CODE:{
		[h:thisCreatureDisplayName = base64.decode(json.get(json.get(creature,"MTProperties"),"name"))]
		[h:replaceChoicesInput = listAppend(replaceChoicesInput," replaceChoice"+safeCounter+" | Replace Old Entry,Keep Old Entry,Duplicate Entries | "+thisCreatureDisplayName+" | LIST "," ## ")]
		[h:safeCounter = safeCounter + 1]
	}]

	[h:abort(input(replaceChoicesInput))]

	[h:safeCounter = 0]
	[h,foreach(creature,repeatEntryTest),CODE:{
		[h:thisCreatureBehavior = eval("replaceChoice"+safeCounter)]
		[h:thisCreatureName = json.get(json.get(creature,"MTProperties"),"name")]

		[h,switch(thisCreatureBehavior):
			case 0: oldBestiary = json.path.delete(oldBestiary,"\$[*][?(@.MTProperties.name == '"+thisCreatureName+"')]");
			case 1: newBestiaryEntries = json.path.delete(newBestiaryEntries,"\$[*][?(@.MTProperties.name == '"+thisCreatureName+"')]");
			case 2: ""
		]

		[h:oldCreatureToken = findToken(base64.decode(thisCreatureName),"z.1 Bestiary")]
		[h,if(thisCreatureBehavior == 0 && oldCreatureToken != ""): replacedTokens = json.set(replacedTokens,thisCreatureName,oldCreatureToken)]

		[h:safeCounter = safeCounter + 1]
	}]
}]

[h:newBestiary = json.merge(oldBestiary,newBestiaryEntries)]
[h:newBestiary = json.sort(newBestiary,"a","Name")]

[h:newEntryList = ""]
[h,foreach(NPC,newBestiaryEntries),CODE:{
	[h:thisNPCName = json.get(json.get(NPC,"MTProperties"),"name")]
	[h:newEntryList = json.append(newEntryList,base64.decode(thisNPCName))]
	[h:oldBestiaryToken = json.get(replacedTokens,thisNPCName)]
	[h,if(oldBestiaryToken != ""),CODE:{
		[h:creationLocation = json.set("","x",getTokenX(0,oldBestiaryToken,"z.1 Bestiary"),"y",getTokenY(0,oldBestiaryToken,"z.1 Bestiary"))]
		[h:removeToken(oldBestiaryToken,"z.1 Bestiary")]
	};{
		[h:thisNPCCreatureTypeDisplay = pm.GetDisplayName(json.get(json.get(NPC,"Properties"),"a5e.stat.CreatureType"),"sb.CreatureTypes")]
		[h:creatureTypeLandingZone = findToken(thisNPCCreatureTypeDisplay+" Landing Zone","z.1 Bestiary")]
		[h,if(creatureTypeLandingZone == ""):
			creationLocation = json.set("","x",0,"y",0);
			creationLocation = json.set("","x",getTokenX(0,creatureTypeLandingZone,"z.1 Bestiary"),"y",getTokenY(0,creatureTypeLandingZone,"z.1 Bestiary"))
		]
	}]

	[h:thisBestiaryToken = copyToken(json.get(NPC,"Token"),1)]
	[h:moveTokenToMap(thisBestiaryToken,"z.1 Bestiary",json.get(creationLocation,"x"),json.get(creationLocation,"y"))]
	[h:setName(base64.decode(thisNPCName),thisBestiaryToken,"z.1 Bestiary")]
}]
[h:newEntryDisplay = pm.a5e.CreateDisplayList(newEntryList,"and")]

[h:setLibProperty("sb.Bestiary",newBestiary,"Lib:"+Library)]
[h:broadcast("NPC"+if(json.length(newEntryList) > 1,"s "," ")+newEntryDisplay+" added to the Bestiary of sourcebook "+sourcebookName+".","self")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"): ""]