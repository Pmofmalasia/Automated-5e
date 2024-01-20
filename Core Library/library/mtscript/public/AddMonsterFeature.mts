[h:SharedMonsterFeatureArray = json.sort(data.getData("addon:","pm.a5e.core","sb.MonsterFeatures"),"a","DisplayName")]

[h:SharedMonsterFeatureList = json.path.read(SharedMonsterFeatureArray,"\$[*]['DisplayName']")]

[h:abort(input(
    " FeatureChoice | "+SharedMonsterFeatureList+" | Choose a Feature | LIST | DELIMITER=JSON "
))]

[h:FeatureToAdd = json.set(json.get(SharedMonsterFeatureArray,FeatureChoice),"IsDisplayed",1,"IsActive",1)]

[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),FeatureToAdd))]

[h:MacroCreationData = json.set("",
	"AbilityList",json.get(FeatureToAdd,"ButtonInfo"),
	"Effects",json.get(FeatureToAdd,"Effects"),
	"ParentToken",currentToken()
)]

[h,MACRO("CreatePlayerClassMacro@Lib:pm.a5e.Core"): MacroCreationData]

[h:broadcast("Added "+json.get(SharedMonsterFeatureList,FeatureChoice)+" feature to "+getName()+".")]