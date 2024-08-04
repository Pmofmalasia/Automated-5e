[h:StoredTokenIDs = macro.args]
[h:StoredTokens = "[]"]

[h,foreach(token,StoredTokenIDs),CODE:{
	[h:thisTokenJSON = "{}"]

	[h:thisTokenProperties = "{}"]
	[h:currentProperties = getPropertyNamesRaw("json",token)]
	[h:changedProperties = "[]"]
	[h,foreach(prop,currentProperties),CODE:{
		[h,if(getRawProperty(prop,token) != ""): thisTokenProperties = json.set(thisTokenProperties,prop,getRawProperty(prop,token))]
		[h,if(getRawProperty(prop,token) != ""): changedProperties = json.append(changedProperties,prop)]
	}]
	[h:thisTokenProperties = json.remove(thisTokenProperties,"a5e.stat.DisplaySheetStats")]
	[h:thisTokenJSON = json.set(thisTokenJSON,"RawPropertyNames",changedProperties)]

	[h,MACRO("ComparisonPropsToJSON@Lib:pm.a5e.Core"): json.set("","Token",token,"OldProps",thisTokenProperties)]
	[h:thisTokenJSON = json.set(thisTokenJSON,"Properties",macro.return)]

	[h:thisTokenMacros = "[]"]
	[h:currentMacroNames = getMacros("json",token)]
	[h,foreach(macroName,currentMacroNames),CODE:{
		[h:thisMacroIndex = getMacroIndexes(macroName,"json",token)]
		[h,foreach(index,thisMacroIndex): thisTokenMacros = json.append(thisTokenMacros,getMacroProps(index,"json",token))]
	}]
	[h:thisTokenJSON = json.set(thisTokenJSON,"Macros",thisTokenMacros)]

	[h:otherProps = json.set("",
		"name",base64.encode(getName(token)),
		"label",base64.encode(getLabel(token)),
		"gmName",base64.encode(getGMName(token)),
		"size",getSize(token),
		"tokenImage",getTokenImage("",token),
		"tokenPortrait",getTokenPortrait("",token),
		"tokenHandout",getTokenHandout("",token),
		"Sight",getSightType(token),
		"Notes",base64.encode(getNotes(token)),
		"GMNotes",base64.encode(getGMNotes(token)),
		"PropertyType",getPropertyType(token)
	)]
	[h:thisTokenJSON = json.set(thisTokenJSON,"MTProperties",otherProps)]
	[h:thisTokenJSON = json.set(thisTokenJSON,"Name",pm.RemoveSpecial(getName(token)),"Token",token)]

	[h:StoredTokens = json.append(StoredTokens,thisTokenJSON)]
}]

[h:return(0,StoredTokens)]