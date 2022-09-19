[h:d20Data = arg(0)]

[h:CurrentSkillDisplay = json.get(d20Data,"Skill")]
[h:CurrentSkill = pm.RemoveSpecial(CurrentSkillDisplay)]

[h,if(json.get(d20Data,"Alternate")==""),CODE:{
	[h,SWITCH(d20Type):
		case "Ability Score": PrimeStat = CurrentSkill;
		case "Skill": PrimeStat = json.get(json.path.read(getLibProperty("sb.Skills","Lib:pm.a5e.Core"),"[?(@.Name=='"+CurrentSkill+"')]['Attribute']"),0);
		case "Tool": PrimeStat = json.get(json.path.read(getLibProperty("sb.Tools","Lib:pm.a5e.Core"),"[?(@.Name=='"+CurrentSkill+"')]['Attribute']"),0);
		case "Initiative": PrimeStat = "Dexterity";
		default: PrimeStat = "None"
	]
};{
	[h:PrimeStat = pm.RemoveSpecial(json.get(d20Data,"Alternate"))]
}]