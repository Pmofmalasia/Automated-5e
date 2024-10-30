[h:abort(input(
	" Name |  | Environment Name ",
	" Source | "+pm.GetBookInfo("DisplayName","json")+" | Which sourcebook is the environment from | LIST | VALUE=STRING DELIMITER=JSON "
))]

[h:EnvironmentData = json.set("",
	"Name",js.a5e.RemoveSpecial(Name),
	"DisplayName",Name
)]

[h:SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[*][?(@.Name=='"+js.a5e.RemoveSpecial(Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.Environments",json.append(getLibProperty("sb.Environments","Lib:"+SourcebookLib),EnvironmentData),"Lib:"+SourcebookLib)]

[h:broadcast(Name+" environment from the sourcebook "+Source+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]