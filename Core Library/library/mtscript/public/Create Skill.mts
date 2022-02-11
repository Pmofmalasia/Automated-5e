[h:abort(input(
	" sk.Name | -- Name Here -- | Enter skill name ",
	" sk.Attribute | "+pm.GetAttributes("DisplayName")+" | Choose an associated attribute | LIST | VALUE=STRING ",
	" sk.SkillType | Skill,Tool | Choose a Skill Type | Radio | VALUE=STRING ",
	" sk.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the skill from | LIST | VALUE=STRING "
	))]

[h:sk.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(sk.Source)+"')]['Library']"),0)]

[h,if(sk.SkillType == "Skill"),CODE:{
	[h:setLibProperty("sb.Skills",
			json.append(getLibProperty("sb.Skills","Lib:"+sk.SourcebookLib),json.set("","Name",pm.RemoveSpecial(sk.Name),"DisplayName",sk.Name,"Attribute",pm.RemoveSpecial(sk.Attribute))),
			"Lib:"+sk.SourcebookLib
		)]
};{}]

[h,if(sk.SkillType == "Tool"),CODE:{
	[h:setLibProperty("sb.Tools",
			json.append(getLibProperty("sb.Tools","Lib:"+sk.SourcebookLib),json.set("","Name",pm.RemoveSpecial(sk.Name),"DisplayName",sk.Name,"Attribute",pm.RemoveSpecial(sk.Attribute))),
			"Lib:"+sk.SourcebookLib
		)]
};{}]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]