[h:DamageTypeTags = pm.a5e.GetCoreData("sb.DamageTypeTags")]
[h:DamageTypeTagOptions = ""]
[h,foreach(tempTag,DamageTypeTags): DamageTypeTagOptions = listAppend(DamageTypeTagOptions," choice"+json.get(tempTag,"Name")+" |  | "+json.get(tempTag,"DisplayName")+" | CHECK ","##")]

[h:abort(input(
	" sp.Name |  | Enter damage type name ",
	DamageTypeTagOptions,
	" otherDamageTypeTag |  | Add Tag not Shown | CHECK ",
	" sp.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the damage type from | LIST | VALUE=STRING "
))]

[h:DamageTypeTagsChosen = ""]
[h,foreach(tempTag,DamageTypeTags): DamageTypeTagsChosen = if(eval("choice"+json.get(tempTag,"Name")),json.append(DamageTypeTagsChosen,json.get(tempTag,"Name")),DamageTypeTagsChosen)]

[h,if(otherDamageTypeTag),CODE:{
	[h:MACRO("CreateDamageTypeTag@Lib:pm.a5e.Core"): ""]
	[h:DamageTypeTagsChosen = json.append(DamageTypeTagsChosen,macro.return)]
};{}]

[h:sp.SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"[?(@.Name=='"+pm.RemoveSpecial(sp.Source)+"')]['Library']"),0)]

[h:damageData = json.set("",
	"Name",pm.RemoveSpecial(sp.Name),
	"DisplayName",sp.Name,
	"Tags",DamageTypeTagsChosen,
	"Library",sp.SourcebookLib
)]

[h:setLibProperty("sb.DamageTypes",json.append(getLibProperty("sb.DamageTypes","Lib:"+sp.SourcebookLib),damageData),"Lib:"+sp.SourcebookLib)]
[h:broadcast("Damage Type "+sp.Name+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"): ""]