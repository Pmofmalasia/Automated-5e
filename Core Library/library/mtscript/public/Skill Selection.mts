[h:sk.ValidSkills = macro.args]
[h:listTraining=json.fromList("Untrained,Proficient,Expertise")]

[h:"<!-- Temp Valid Test explanation: 1 = gives proficiency, 2 = gives expertise, 3 = gives proficiency, or expertise if proficient. Therefore, a choice should not be made if ValidSkills is not offering a type of proficiency greater than already held, or if the skill is already at expertise. -->"]
[h:"<!-- sk.TrainingOptions removes invalid options from being chosen, preventing from choosing a level of proficiency not available or choosing a proficiency below what they already have. -->"]

[h:sk.SaveInput = ""]
[h:sk.SaveList = pm.GetAttributes()]
[h,foreach(TempSave,sk.SaveList),CODE:{
	[h:sk.TempProficiency = if(json.get(Saves,json.get(TempSave,"Name"))=="",0,json.get(Saves,json.get(TempSave,"Name")))]
	[h:sk.TempIsOption = if(json.get(sk.ValidSkills,json.get(TempSave,"Name"))=="",0,json.get(sk.ValidSkills,json.get(TempSave,"Name")))]
	[h:sk.TrainingOptions = json.toList(json.get(listTraining,sk.TempProficiency,min(2,if(sk.TempIsOption==3,sk.TempProficiency+1,sk.TempIsOption))))]
	[h:sk.TempValidTest = if(and(sk.TempIsOption>sk.TempProficiency,sk.TempProficiency!=2),1,0)]
	[h,if(sk.TempValidTest),CODE:{
		[h:sk.SaveInput = listAppend(sk.SaveInput,"sk."+json.get(TempSave,"Name")+"Prof | "+sk.TrainingOptions+" | "+json.get(TempSave,"DisplayName")+" Saves | LIST | ","##")]
	};{
		[h:set("sk."+json.get(TempSave,"Name")+"Prof",0)]
	}]
}]
[h:sk.SaveInput = if(sk.SaveInput=="","",listAppend(" junkVar | ----------------- Save Proficiencies ----------------- | | LABEL | SPAN=TRUE ",sk.SaveInput,"##"))]

[h:sk.SkillInput = ""]
[h:sk.SkillList = pm.GetSkills()]
[h,foreach(TempSkill,sk.SkillList),CODE:{
	[h:sk.TempProficiency = if(json.get(Skills,json.get(TempSkill,"Name"))=="",0,json.get(Skills,json.get(TempSkill,"Name")))]
	[h:sk.TempIsOption = if(json.get(sk.ValidSkills,json.get(TempSkill,"Name"))=="",0,json.get(sk.ValidSkills,json.get(TempSkill,"Name")))]
	[h:sk.TrainingOptions = json.toList(json.get(listTraining,sk.TempProficiency,min(2,if(sk.TempIsOption==3,sk.TempProficiency+1,sk.TempIsOption))))]
	[h:sk.TempValidTest = if(and(sk.TempIsOption>sk.TempProficiency,sk.TempProficiency!=2),1,0)]
	[h,if(sk.TempValidTest),CODE:{
		[h:sk.SkillInput = listAppend(sk.SkillInput,"sk."+json.get(TempSkill,"Name")+"Prof | "+sk.TrainingOptions+" | "+json.get(TempSkill,"DisplayName")+" | LIST ","##")]
	};{
		[h:set("sk."+json.get(TempSkill,"Name")+"Prof",0)]
	}]
}]
[h:sk.SkillInput = if(sk.SkillInput=="","",listAppend(" junkVar | ----------------- Skill Proficiencies ----------------- | | LABEL | SPAN=TRUE ",sk.SkillInput,"##"))]

[h:sk.ToolInput = ""]
[h:sk.ToolList = pm.GetTools()]
[h,foreach(TempTool,sk.ToolList),CODE:{
	[h:sk.TempProficiency = if(json.get(Tools,json.get(TempTool,"Name"))=="",0,json.get(Tools,json.get(TempTool,"Name")))]
	[h:sk.TempIsOption = if(json.get(sk.ValidSkills,json.get(TempTool,"Name"))=="",0,json.get(sk.ValidSkills,json.get(TempTool,"Name")))]
	[h:sk.TrainingOptions = json.toList(json.get(listTraining,sk.TempProficiency,min(2,if(sk.TempIsOption==3,sk.TempProficiency+1,sk.TempIsOption))))]
	[h:sk.TempValidTest = if(and(sk.TempIsOption>sk.TempProficiency,sk.TempProficiency!=2),1,0)]
	[h,if(sk.TempValidTest),CODE:{
		[h:sk.ToolInput = listAppend(sk.ToolInput,"sk."+json.get(TempTool,"Name")+"Prof | "+sk.TrainingOptions+" | "+json.get(TempTool,"DisplayName")+" | LIST | ","##")]
	};{
		[h:set("sk."+json.get(TempTool,"Name")+"Prof",0)]
	}]
}]
[h:sk.ToolInput = if(sk.ToolInput=="","",listAppend(" junkVar | ----------------- Tool Proficiencies ----------------- | | LABEL | SPAN=TRUE ",sk.ToolInput,"##"))]

[h:sk.InputTitle = if(and(sk.SaveInput=="",sk.SkillInput=="",sk.ToolInput==""),"","junkVar | "+json.get(sk.ValidSkills,"ChoiceText")+" | | LABEL | SPAN=TRUE ")]

[h:abort(input(sk.InputTitle,sk.SaveInput,sk.SkillInput,sk.ToolInput))]

[h:sk.FinalSkills = ""]
[h,foreach(TempSkill,sk.SkillList),CODE:{
	[h:sk.FinalSkills = if(eval("sk."+json.get(TempSkill,"Name")+"Prof")==0,sk.FinalSkills,json.set(sk.FinalSkills,json.get(TempSkill,"Name"),eval("sk."+json.get(TempSkill,"Name")+"Prof")))]
}]

[h,foreach(TempTool,sk.ToolList),CODE:{
	[h:sk.FinalSkills = if(eval("sk."+json.get(TempTool,"Name")+"Prof")==0,sk.FinalSkills,json.set(sk.FinalSkills,json.get(TempTool,"Name"),eval("sk."+json.get(TempTool,"Name")+"Prof")))]
}]

[h:sk.FinalSaves = ""]
[h,foreach(TempSave,sk.SaveList),CODE:{
	[h:sk.FinalSaves = if(eval("sk."+json.get(TempSave,"Name")+"Prof")==0,sk.FinalSaves,json.set(sk.FinalSkills,json.get(TempSave,"Name"),eval("sk."+json.get(TempSave,"Name")+"Prof")))]
}]

[h:macro.return = json.set("","Saves",sk.FinalSaves,"Skills",sk.FinalSkills)]