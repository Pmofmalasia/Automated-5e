[h:RemovedTokens = getSelected()]
[h:RemovedTokensDisplay = ""]
[h,foreach(tempToken,RemovedTokens): RemovedTokensDisplay = listAppend(RemovedTokensDisplay," junkVar | "+getImage(tempToken)+" | "+getName(tempToken)+" | LABEL | ICON=TRUE ","##")]
[h:abort(input(
	" junkVar | Click OK to confirm. | The following tokens will be deleted | LABEL ",
	RemovedTokensDisplay
))]

[h,foreach(tempToken,RemovedTokens),CODE:{
	
}]