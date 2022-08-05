[h:ab.Updates = macro.args]

[h:disInitial = "junkVar | ------- Select Levels at Which "+json.get(ab.Updates,"DisplayName")+" Changes ------- |  | LABEL | SPAN=TRUE "]

[h:ab.StartingLevel = json.get(ab.Updates,"Level")]

[h,count(20-ab.StartingLevel): disInitial = listAppend(disInitial," temp."+(roll.count+1+ab.StartingLevel)+" |  | Level "+(roll.count+1+ab.StartingLevel)+" | CHECK ","##")]

[h:abort(input(disInitial))]

[h,count(20-ab.StartingLevel),CODE:{
	[h:ab.LevelTest = eval("temp."+(roll.count+1+ab.StartingLevel))]
	[h,if(ab.LevelTest),CODE:{
		[h:ab.Updates = json.set(ab.Updates,string(roll.count+1+ab.StartingLevel),pm.AbilityUpdateInputs((roll.count+1+ab.StartingLevel),ab.Updates))]
	};{}]
}]

[h:setLibProperty("sb.AbilityUpdates",json.append(getLibProperty("sb.AbilityUpdates","Lib:"+json.get(ab.Updates,"Library")),ab.Updates),"Lib:"+json.get(ab.Updates,"Library"))]