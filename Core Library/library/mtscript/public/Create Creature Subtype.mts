[h:creatureTypes = pm.GetCreatureTypes()]
[h:creatureTypeOptions = ""]
[h,foreach(tempType,creatureTypes): creatureTypeOptions = json.append(creatureTypeOptions,json.get(tempType,"DisplayName"))]

[h:abort(input(
	" ct.Name | -- Name Here -- | Enter Creature Subtype Name ",
	"ct.CreatureType | "+creatureTypeOptions+" | Associated Creature Type | LIST | DELIMITER=JSON ",
	" ct.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the creature subtype from | LIST | VALUE=STRING "
))]

[h:ct.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(ct.Source)+"')]['Library']"),0)]

[h:ct.Data = json.set("",
	"Name",pm.RemoveSpecial(ct.Name),
	"DisplayName",ct.Name,
	"CreatureType",json.get(json.get(creatureTypes,ct.CreatureType),"Name"),
	"Library",ct.SourcebookLib
)]

[h:setLibProperty("sb.CreatureSubtypes",json.append(getLibProperty("sb.CreatureSubtypes","Lib:"+ct.SourcebookLib),ct.Data),"Lib:"+ct.SourcebookLib)]

[r:ct.Name+" creature subtype from the sourcebook "+ct.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]