[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:fs.Groups = json.path.read(a5e.UnifiedAbilities,"[*][?(@.FightingStyleList!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:fs.GroupNum = json.length(fs.Groups)]

[h:fs.Input = ""]
[h:IsTooltip = 0]
[h:"<!-- Note: Need to add a mechanism for determining the allowed number of fighting styles; actually get the display name for the class/subclass for the group header -->"]
[h:fs.AllowedChoices = ""]
[h:fs.Current = "{}"]
[h:fs.AllOptions = "{}"]
[h,foreach(TempGroup,fs.Groups),CODE:{
	[h:abilityInfo = TempGroup]
	[h:TempGroupName = json.get(TempGroup,"Class")+json.get(TempGroup,"Subclass")]
	[h:pm.ChoiceNum = 1]
	
	[h:pm.PassiveFunction("FeatureChoiceNum")]

	[h:fs.AllowedChoices = json.set(fs.AllowedChoices,TempGroupName,pm.ChoiceNum)]

	[h:fs.Input = if(fs.GroupNum==1," junkVar | ------------------ Select "+pm.ChoiceNum+" Fighting Style"+if(pm.ChoiceNum>1,"s","")+" ------------------ |  | LABEL | SPAN=TRUE ",listAppend(fs.Input," junkVar | ------------------ Select "+pm.ChoiceNum+" "+pm.GetDisplayName(json.get(TempGroup,"Class"),"sb.Classes")+" Fighting Style"+if(pm.ChoiceNum>1,"s","")+" ------------------ |  | LABEL | SPAN=TRUE ","##"))]
	
	[h:thisGroupFSOptions = json.sort(json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.Class == 'FightingStyle' && @.Name in "+json.get(TempGroup,"FightingStyleList")+")]"),"a","Name")]
	[h:fs.AllOptions = json.set(fs.AllOptions,TempGroupName,thisGroupFSOptions)]
	
	[h:fs.ThisGroupCurrent = "[]"]
	[h:"<!-- Change AssociatedClass to StoredValue? No, since can't have 2 subclasses anyway. -->"]
	[h,foreach(TempFS,thisGroupFSOptions),CODE:{
		[h:tempIsActiveTest = !json.isEmpty(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+json.get(TempFS,"Name")+"' && @.Class=='FightingStyle' && @.AssociatedClass=='"+json.get(TempGroup,"Class")+"' && @.IsActive > 0)]"))]
		[h,if(tempIsActiveTest): fs.ThisGroupCurrent = json.merge(fs.ThisGroupCurrent,json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Name=='"+json.get(TempFS,"Name")+"' && @.Class=='FightingStyle' && @.Subclass=='"+json.get(TempFS,"Subclass")+"')]"))]
		[h:set("pm.Choose"+json.get(TempFS,"Name")+json.get(TempGroup,"Class"),tempIsActiveTest)]
		[h:fs.Input = listAppend(fs.Input," pm.Choose"+json.get(TempFS,"Name")+json.get(TempGroup,"Class")+" | "+eval("pm.Choose"+json.get(TempFS,"Name")+json.get(TempGroup,"Class"))+" | "+json.get(TempFS,"DisplayName")+" | CHECK ","##")]
	}]
	
	[h:fs.Current = json.set(fs.Current,TempGroupName,fs.ThisGroupCurrent)]
}]

[h:abort(input(fs.Input))]

[h:abilityTable = ""]
[h,foreach(TempGroup,fs.Groups),CODE:{
	[h:TempGroupName = json.get(TempGroup,"Class")+json.get(TempGroup,"Subclass")]
	[h:fs.ChosenStr = ""]
	[h:thisGroupFSOptions = json.get(fs.AllOptions,TempGroupName)]
	[h:thisGroupFSCurrent = json.get(fs.Current,TempGroupName)]
	
	[h:fs.ChosenCount = 0]
	[h:fs.ChosenAbilities = ""]
	[h,foreach(TempFS,thisGroupFSOptions),CODE:{
		[h:fs.ChosenTest = eval("pm.Choose"+json.get(TempFS,"Name")+json.get(TempGroup,"Class"))]
		[h,if(fs.ChosenTest): fs.ChosenAbilities = json.append(fs.ChosenAbilities,TempFS)]
		[h:fs.ChosenCount = fs.ChosenCount + fs.ChosenTest]
	}]
	
	[h:fs.New = json.difference(fs.ChosenAbilities,thisGroupFSCurrent)]
	[h:fs.Removed = json.difference(thisGroupFSCurrent,fs.ChosenAbilities)]
	[h,MACRO("NewAbilityProcessing@Lib:pm.a5e.Core"): json.set("","Abilities",fs.New,"ParentToken",ParentToken)]
	[h,MACRO("NewFeatureAddition@Lib:pm.a5e.Core"): json.set(json.path.put(macro.return,"['Abilities'][*]","AssociatedClass",json.get(TempGroup,"Class")),"ParentToken",ParentToken)]
	[h,MACRO("FeatureRemoval@Lib:pm.a5e.Core"): json.set("","Features",fs.Removed,"ParentToken",ParentToken)]
	
	[h:fs.ChosenStr = json.toList(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Class=='FightingStyle' && @.AssociatedClass=='"+json.get(TempGroup,"Class")+"' && @.IsActive > 0)]['DisplayName']"),if(getLibProperty("VerticalDisplay","Lib:pm.a5e.Core")==1,"<br>",", "))]
	
	[h:TempDisplayName = pm.GetDisplayName(json.get(TempGroup,"Class"),"sb.Classes")]
	
	[h:abilityTable = json.append(abilityTable,json.set("","ShowIfCondensed",1,"Header",if(fs.GroupNum==1,"",TempDisplayName+" ")+"Fighting Styles Chosen","FalseHeader","","FullContents","","RulesContents",fs.ChosenStr,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Error",if(fs.ChosenCount>json.get(fs.AllowedChoices,TempGroupName),"Too many "+if(fs.GroupNum==1,"",TempDisplayName+" ")+"fighting styles were chosen!","")))]
}]

[h:fs.DuplicateTest = json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Class=='FightingStyle')]['Name']")]
[h:fs.Duplicates = json.difference(json.unique(fs.DuplicateTest),fs.DuplicateTest)]
[h:"<!-- Need a way to display the duplicates as an alert, since they do not have a table row to be linked with by default - and can't insert in other table rows, since there might be duplicates also. May need a mechanism for inserting only an alert without a table. Could probably have the error color change if the header says error also (could choose a different name since error might make it seem like something is wrong, but alert won't work since there's an Alert feature!) -->"]
[h,if(!json.isEmpty(fs.Duplicates)),CODE:{
	[h:fs.Duplicates = ""]
};{}]

[h:ClassFeatureData = json.set("",
	"Flavor","",
	"ParentToken",ParentToken,
	"DMOnly",0,
	"Class","FightingStyle",
	"Name","Manage Fighting Styles",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]

[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]