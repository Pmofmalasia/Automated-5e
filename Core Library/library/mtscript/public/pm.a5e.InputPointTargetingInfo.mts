[h,if(argCount()>0),CODE:{
	[h:extraTopLines = json.get(arg(0),"ExtraTop")]
	[h:extraBottomLines = json.get(arg(0),"ExtraBottom")]
};{
	[h:extraTopLines = ""]
	[h:extraBottomLines = ""]
}]

[h:abort(input(
	"throwaway|---------------------------------------------- Point Targeting Data ---------------------------------------------||LABEL|SPAN=TRUE",
	extraTopLines,
	" surfaceLimits | None,Ground,Air | Surface Limitations | LIST | VALUE=STRING ",
	extraBottomLines
))]
