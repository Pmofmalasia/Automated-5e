[h,if(argCount()>0): sv.ExtraInput = json.toList(arg(0),"##") ; sv.ExtraInput = ""]
[h:sv.Input = ""]
[h,foreach(TempSave,pm.GetAttributes("json")): sv.Input = listAppend(sv.Input," sv."+TempSave+"Choice |  | "+TempSave+" Proficiency | CHECK ","##")]

[h:abort(input(
	" junkVar | ---------------------- Save Proficiency Choice Info ---------------------- |  | LABEL | SPAN=TRUE ",
	sv.ExtraInput,
	sv.Input
))]

[h:sv.SaveProfChoices = ""]
[h,foreach(TempSave,pm.GetAttributes("json")): sv.SaveProfChoices = if(eval("sv."+TempSave+"Choice")==0,sv.SaveProfChoices,json.set(sv.SaveProfChoices,TempSave,eval("sv."+TempSave+"Choice")))]
		
[h,if(argCount()>0): sv.ExtraKeys = arg(2); sv.ExtraKeys = ""]
[h,foreach(key,sv.ExtraKeys),CODE:{
	[h:sv.SaveProfChoices = json.set(sv.SaveProfChoices,key,eval(json.get(arg(1),roll.count)))]
}]
[h:macro.return = sv.SaveProfChoices]