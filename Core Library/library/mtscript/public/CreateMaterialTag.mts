[h:abort(input(
    " junkVar | -------------- Create Material Tag -------------- |  | LABEL | SPAN=TRUE ",
    " materialTagDisplayName |  | Name ",
    " materialTagLibrary | "+pm.GetBookInfo("DisplayName")+" | Associated Sourcebook | LIST | VALUE=STRING "
))]

[h:sourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(materialTagLibrary)+"')]['Library']"),0)]

[h:materialTagName = pm.RemoveSpecial(materialTagDisplayName)]

[h:materialTagData = json.set("",
	"Name",materialTagName,
	"DisplayName",materialTagDisplayName,
	"Library",sourcebookLib
)]

[h:setLibProperty("sb.MaterialTags",json.append(getLibProperty("sb.MaterialTags","Lib:"+sourcebookLib),materialTagData),"Lib:"+sourcebookLib)]
[h:broadcast("Material Tag "+materialTagDisplayName+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"): ""]

[h:macro.return = materialTagName]