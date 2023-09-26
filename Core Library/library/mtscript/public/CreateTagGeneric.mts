[h:TagType = macro.args]

[h:abort(input(
    " junkVar | --------------------- Create "+TagType+" Tag --------------------- |  | LABEL | SPAN=TRUE ",
    " TagDisplayName |  | Input Tag ",
    " TagLibrary | "+pm.GetBookInfo("DisplayName")+" | Associated Sourcebook | LIST | VALUE=STRING "
))]

[h:sourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[?(@.Name=='"+pm.RemoveSpecial(TagLibrary)+"')]['Library']"),0)]

[h:TagName = pm.RemoveSpecial(TagDisplayName)]

[h:TagData = json.set("",
	"Name",TagName,
	"DisplayName",TagDisplayName,
	"Library",sourcebookLib
)]

[h:setLibProperty("sb."+TagType+"Tags",json.append(getLibProperty("sb."+TagType+"Tags","Lib:"+sourcebookLib),TagData),"Lib:"+sourcebookLib)]
[h:broadcast(TagType+" Tag "+TagDisplayName+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"): ""]

[h:macro.return = TagName]