[h:NotALibTest = json.contains(getTokens("json"),getSelected())]
[h:assert(NotALibTest,"Resetting Library tokens will break everything - please don't do that.")]

[h:abort(input(
	"junkVar | "+getTokenImage()+" |  | LABEL | SPAN=TRUE ICON=TRUE ",
	"Answeryn|No,Yes|Do you really wish to reset this token?|LIST"
))]
[h:abort(Answeryn)]

[h:setPropertyType("A5ECreature")]

[h:PropNames=getPropertyNamesRaw("json")]

[h:allMacros=getMacros("json")]

[h,count(json.length(allMacros)),CODE:{
	[h:deletingMacro=getMacroIndexes(json.get(allMacros,roll.count),"json")]
	[count(json.length(deletingMacro)),CODE:{
		[h:deletedMacro=json.get(deletingMacro,roll.count)]
		[removeMacro(deletedMacro)]
	}]
}]

[h,foreach(prop,PropNames),code:{
	[resetProperty(prop)]
}]