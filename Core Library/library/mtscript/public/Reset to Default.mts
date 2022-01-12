[h:NotALibTest = if(json.contains(getTokens("json"),getSelected()),1,0)]
[h:assert(NotALibTest,"Resetting Library tokens will break everything - please don't do that.")]

[h:Confirmation=input(
	"junkVar | "+getTokenImage()+" |  | LABEL | SPAN=TRUE ICON=TRUE ",
	"Answeryn|No,Yes|Do you really wish to reset this token?|LIST"
)]
[h:abort(Confirmation)]
[h:abort(Answeryn)]
[h:setPropertyType("Basic")]

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