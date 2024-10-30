[h:abort(input(
    " junkVar | -------------- Create Damage Type Tag -------------- |  | LABEL | SPAN=TRUE ",
    " damageTagName |  | Name ",
    " damageTagLibrary | "+pm.GetBookInfo("DisplayName")+" | Associated Sourcebook | LIST | VALUE=STRING "
))]

[h:sourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[?(@.Name=='"+js.a5e.RemoveSpecial(damageTagLibrary)+"')]['Library']"),0)]

[h:damageTagData = json.set("",
	"Name",js.a5e.RemoveSpecial(damageTagName),
	"DisplayName",damageTagName,
	"Library",sourcebookLib
)]

[h:setLibProperty("sb.DamageTypeTags",json.append(getLibProperty("sb.DamageTypeTags","Lib:"+sourcebookLib),damageTagData),"Lib:"+sourcebookLib)]
[h:broadcast("Damage Type Tag "+damageTagName+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"): ""]