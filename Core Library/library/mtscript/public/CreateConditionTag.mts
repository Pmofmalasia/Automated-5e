[h:abort(input(
    " junkVar | -------------- Create Condition Tag -------------- |  | LABEL | SPAN=TRUE ",
    " conditionTagDisplayName |  | Name ",
    " conditionTagLibrary | "+pm.GetBookInfo("DisplayName")+" | Associated Sourcebook | LIST | VALUE=STRING "
))]

[h:sourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(conditionTagLibrary)+"')]['Library']"),0)]

[h:conditionTagName = pm.RemoveSpecial(conditionTagDisplayName)]

[h:conditionTagData = json.set("",
	"Name",conditionTagName,
	"DisplayName",conditionTagDisplayName,
	"Library",sourcebookLib
)]

[h:setLibProperty("sb.ConditionTags",json.append(getLibProperty("sb.ConditionTags","Lib:"+sourcebookLib),conditionTagData),"Lib:"+sourcebookLib)]
[h:broadcast("Condition Tag "+conditionTagDisplayName+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"): ""]

[h:macro.return = conditionTagName]