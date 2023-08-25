[h:MaterialTags = pm.a5e.GetCoreData("sb.MaterialTags")]
[h:MaterialTagOptions = ""]
[h,foreach(tempTag,MaterialTags): MaterialTagOptions = listAppend(MaterialTagOptions," choice"+json.get(tempTag,"Name")+" |  | "+json.get(tempTag,"DisplayName")+" | CHECK ","##")]

[h:abort(input(
	" mat.Name |  | Material name ",
	" mat.AC |  | Material base AC ",
	MaterialTagOptions,
	" otherMaterialTag |  | Add Tag not Shown | CHECK ",
	" mat.Source | "+pm.GetBookInfo("DisplayName","json")+" | Which sourcebook is the material from | LIST | VALUE=STRING DELIMITER=JSON "
))]

[h:MaterialTagsChosen = ""]
[h,foreach(tempTag,MaterialTags): MaterialTagsChosen = if(eval("choice"+json.get(tempTag,"Name")),json.append(MaterialTagsChosen,json.get(tempTag,"Name")),MaterialTagsChosen)]

[h,if(otherMaterialTag),CODE:{
	[h:MACRO("CreateMaterialTag@Lib:pm.a5e.Core"): ""]
	[h:MaterialTagsChosen = json.append(MaterialTagsChosen,macro.return)]
};{}]

[h:mat.MaterialData = json.set("",
	"Name",pm.RemoveSpecial(mat.Name),
	"DisplayName",mat.Name,
	"AC",mat.AC,
	"Tags",MaterialTagsChosen
)]

[h:mat.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(mat.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.ObjectMaterials",json.append(getLibProperty("sb.ObjectMaterials","Lib:"+mat.SourcebookLib),mat.MaterialData),"Lib:"+mat.SourcebookLib)]

[r:mat.Name+" material from the sourcebook "+mat.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]