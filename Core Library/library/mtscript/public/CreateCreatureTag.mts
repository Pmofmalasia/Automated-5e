[h:creatureTypes = json.merge(json.append("",json.set("","Name","","DisplayName","None")),pm.GetCreatureTypes())]
[h:creatureTypeOptions = ""]
[h,foreach(tempType,creatureTypes): creatureTypeOptions = json.append(creatureTypeOptions,json.get(tempType,"DisplayName"))]

[h:abort(input(
	" ct.Name | -- Name Here -- | Enter Creature Tag Name ",
	"ct.CreatureType | "+creatureTypeOptions+" | Associated Creature Type | LIST | DELIMITER=JSON ",
	" ct.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the creature tag from | LIST | VALUE=STRING "
))]

[h:ct.SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[*][?(@.Name=='"+js.a5e.RemoveSpecial(ct.Source)+"')]['Library']"),0)]

[h:ct.Data = json.set("",
	"Name",js.a5e.RemoveSpecial(ct.Name),
	"DisplayName",ct.Name,
	"CreatureType",json.get(json.get(creatureTypes,ct.CreatureType),"Name"),
	"Library",ct.SourcebookLib
)]

[h:setLibProperty("sb.CreatureTags",json.append(getLibProperty("sb.CreatureTags","Lib:"+ct.SourcebookLib),ct.Data),"Lib:"+ct.SourcebookLib)]

[h:broadcast(ct.Name+" creature tag from the sourcebook "+ct.Source+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]