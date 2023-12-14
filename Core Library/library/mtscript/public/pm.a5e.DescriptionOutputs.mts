[h:OutputRules = arg(0)]
[h:NoFullMacro = json.get(OutputRules,"NoFullMacro")]
[h:NoRules = json.get(OutputRules,"NoRules")]
[h:ShowFullRules = arg(1)]
[h:Description = arg(2)]
[h:AbridgedDescription = arg(3)]

[h,if(Description == "" && AbridgedDescription == ""): return(0,json.set("","Player","","GM",""))]

[h,if(or(NoRules,NoFullMacro)),CODE:{
	[h:PlayerDescription = ""]
};{
	[h,if(ShowFullRules): PlayerDescription = Description; PlayerDescription = AbridgedDescription]
}]

[h,if(ShowFullRules): GMDescription = Description; GMDescription = AbridgedDescription]

[h:return(0,json.set("","Player",PlayerDescription,"GM",GMDescription))]