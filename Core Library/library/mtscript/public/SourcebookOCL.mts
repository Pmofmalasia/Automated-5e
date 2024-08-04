[h:LibraryData = macro.args]
[h:Library = json.get(LibraryData,"Library")]

[h,foreach(TempMacro,getMacros("json","Lib:"+Library)),CODE:{
	[h:NameComponentNum = listCount(TempMacro," ### ")]
	[h:MacroType = listGet(TempMacro,NameComponentNum-1," ### ")]
	[h,if(TempMacro!="onCampaignLoad" && or(MacroType=="Passive",MacroType=="Condition")),CODE:{
		[h:TempFunctionName = "pm."+replace(replace(TempMacro," ",""),"#","")]
		[h:defineFunction(TempFunctionName,TempMacro+"@Lib:"+Library,0,0)]
	};{}]
}]