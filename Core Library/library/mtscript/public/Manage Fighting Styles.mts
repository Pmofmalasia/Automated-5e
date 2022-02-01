[h:CharacterClasses = json.fields(LClass)]
[h:fs.Classes = ""]
[h,foreach(TempClass,CharacterClasses): fs.Classes = if(json.isEmpty(json.path.read(getLibProperty("sb.Classes","Lib:pm.a5e.Core"),"[?(@.FightingStyleLevels!=null)]","DEFAULT_PATH_LEAF_TO_NULL")),fs.Classes,json.append(fs.Classes,TempClass))]
[h:fs.ClassNum = json.length(fs.Classes)]

[h:fs.Input = ""]
[h,foreach(TempClass,fs.Classes),CODE:{

	[h:fs.Input = if(fs.ClassNum==1," junkVar | ------------------ Select Fighting Styles ------------------ |  | LABEL | SPAN=TRUE ",listAppend(fs.Input," junkVar | ------------------ Select "+json.get(TempClass,"DisplayName")+" Fighting Styles ------------------ |  | LABEL | SPAN=TRUE ","##"))]
	[h:thisClassFSKnown = json.path.read(allAbilities,"[?(@.Class=='FightingStyle' && @.AssociatedClass=='"+TempClass+"')]")]
	[h:thisClassFSOptions = "None,"+json.toList(json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.PrereqsFinal.Class anyof ['"+TempClass+"'] && @.Class == 'FightingStyle')]['DisplayName']"))]
	
	[h:thisClassCount = 0]
	[h,foreach(TempLevel,json.get(TempClass,"FightingStyleLevels")),CODE:{
		[h:fs.Input = listAppend(fs.Input,,"##")]