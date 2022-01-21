[h:bg.Array = getLibProperty("sb.Backgrounds","Lib:pm.a5e.Core")]
[h:bg.Options = listSort(json.toList(json.path.read(bg.Array,"[*].DisplayName")),"A+")]
[h:abort(input(
	" bg.Choice | Choose Two Proficiencies,"+bg.Options+" | Choose a background | RADIO "
	))]

[h,if(bg.Choice==0),CODE:{
	[h:bg.Custom = json.set("","Name","CustomBackground","DisplayName","Custom Background","Class","Background","Subclass","","Level",1,"GainOnLevel",1)]
	[h:bg.SkillOptions = ""]
	[h,foreach(TempSkill,pm.GetSkills("Name","json")),CODE:{
		[h:bg.SkillOptions = json.set(bg.SkillOptions,TempSkill,1)]
	}]
	[h,foreach(TempTool,pm.GetTools("Name","json")),CODE:{
		[h:bg.SkillOptions = json.set(bg.SkillOptions,TempTool,1)]
	}]
	[h:macro.return = json.set(bg.Custom,"SkillOptions",json.set(bg.SkillOptions,"ChoiceNum",2,"ChoiceText","Choose any 2 of the following"))]
};{
	[h:macro.return = json.get(bg.Array,bg.Choice-1)]
}]