[h:abort(input(
	"junkVar | --------------- Skill Selection Options --------------- |  | LABEL | SPAN=TRUE",
	" ab.HowChooseSkills | Specified List,All Skills + Some Tools,All Skills,Expertise if Proficient | <html><span title='Specified list is for when you can only choose x, y, or z skill. The other options allow for any skill, and should be used if you ever want to add more skills than the base ones. All Skills + Some Tools allows you to choose tools like the specified list option while keeping the flexibility of the all skills option for skills.'>How are eligible skills chosen</span></html> | LIST "
		))]
		
[r,if(ab.HowChooseSkills<2),CODE:{
	[h:ab.SkillProfChoices = pm.SkillSelectionInput(json.append(""," sk.SkillChoiceNum | 0,1,2,3,4,5,6,7,8 | Number of choices allowed | LIST | SELECT=1 "," sk.SkillChoiceText |  | Type the rules for choices to make "),json.append("","sk.SkillChoiceNum","sk.SkillChoiceText"),json.append("","ChoiceNum","ChoiceText"))]
	[r,if(ab.HowChooseSkills==1): macro.return = json.set(ab.SkillProfChoices,"AllSkills",1); macro.return = ab.SkillProfChoices]
};{
	[h:abort(input(
		" junkVar | ---------------------- Skill Selection Options ---------------------- |  | LABEL | SPAN=TRUE ",
		" sk.SkillChoiceNum | 0,1,2,3,4,5,6,7,8 | Number of choices allowed | LIST | SELECT=1 ",		
		" sk.SkillChoiceText |  | Type the rules for choices to make "
		))]
	[r,if(ab.HowChooseSkills==3): macro.return = json.set("","ProftoExp",1,"ChoiceNum",sk.SkillChoiceNum,"ChoiceText",sk.SkillChoiceText); macro.return = json.set("","AllSkills",1,"ChoiceNum",sk.SkillChoiceNum,"ChoiceText",sk.SkillChoiceText)]
}]