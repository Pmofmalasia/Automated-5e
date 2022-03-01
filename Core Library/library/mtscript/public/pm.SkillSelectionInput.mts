[h,if(argCount()>0): sk.ExtraInput = json.toList(arg(0),"##") ; sk.ExtraInput = ""]

[h:sk.SkillInput = ""]
[h:sk.SkillList = pm.GetSkills()]
[h,foreach(TempSkill,sk.SkillList),CODE:{
	[h:sk.SkillInput = listAppend(sk.SkillInput,"sk."+json.get(TempSkill,"Name")+" | No,Proficiency,Expertise,Expertise if Proficient | "+json.get(TempSkill,"DisplayName")+" | LIST ","##")]
}]

[h:sk.ToolCategoryInput = ""]
[h:sk.ToolCategoryList = pm.GetToolTypes())]
[h,foreach(TempToolType,sk.ToolCategoryList): sk.ToolCategoryInput = listAppend(sk.ToolCategoryInput," sk."+json.get(TempToolType,"Name")+"Choice | No,Proficiency,Expertise,Expertise if Proficient | All "+json.get(TempToolType,"DisplayName")+"s | LIST ","##")]

[h:sk.ToolInput = ""]
[h:sk.ToolList = pm.GetTools()]
[h,foreach(TempTool,sk.ToolList),CODE:{
	[h:sk.ToolInput = listAppend(sk.ToolInput,"sk."+json.get(TempTool,"Name")+" | No,Proficiency,Expertise,Expertise if Proficient | "+json.get(TempTool,"DisplayName")+" | LIST ","##")]
}]

[h:abort(input(
	sk.ExtraInput,
	" junkVar | ---------------------- Skill Proficiency Choice Info ---------------------- |  | LABEL | SPAN=TRUE ",
	sk.SkillInput,
	" junkVar | ------------------------ Tool Category Choice Info ------------------------ |  | LABEL | SPAN=TRUE ",
	sk.ToolCategoryInput,
	" junkVar | ------------------------ Tool Proficiency Choice Info ------------------------ |  | LABEL | SPAN=TRUE ",
	sk.ToolInput
	))]

[h:sk.SkillProfChoices = ""]
[h,foreach(TempSkill,sk.SkillList): sk.SkillProfChoices = if(eval("sk."+json.get(TempSkill,"Name"))==0,sk.SkillProfChoices,json.set(sk.SkillProfChoices,json.get(TempSkill,"Name"),eval("sk."+json.get(TempSkill,"Name"))))]

[h:sk.ToolTypeProfChoices = ""]
[h,foreach(TempToolType,sk.ToolCategoryList): sk.SkillProfChoices = if(eval("sk."+json.get(TempToolType,"Name")+"Choice")==0,sk.SkillProfChoices,json.set(sk.SkillProfChoices,json.get(TempToolType,"Name"),eval("sk."+json.get(TempToolType,"Name")+"Choice")))]

[h:sk.ToolProfChoices = ""]
[h,foreach(TempTool,sk.ToolList): sk.SkillProfChoices = if(eval("sk."+json.get(TempTool,"Name"))==0,sk.SkillProfChoices,json.set(sk.SkillProfChoices,json.get(TempTool,"Name"),eval("sk."+json.get(TempTool,"Name"))))]

[h,if(argCount()>0): sk.ExtraKeys = arg(2); sk.ExtraKeys = ""]
[h,foreach(key,sk.ExtraKeys),CODE:{
	[h:sk.SkillProfChoices = json.set(sk.SkillProfChoices,key,eval(json.get(arg(1),roll.count)))]
}]
[h:macro.return = sk.SkillProfChoices]