[h:ab.SkillsGranted = pm.SkillSelectionInput(json.append(""," sk.SkillAlreadyProf | No Alternative Gained,Choose Another Skill,Grant Expertise | If already proficient | LIST "," junkVar | ---------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE"),json.append("","sk.SkillAlreadyProf"),json.append("","AlreadyProf"))]
[h:ab.ReselectionTest = json.get(ab.SkillsGranted,"AlreadyProf")]
	
[h,if(ab.ReselectionTest==1),CODE:{
	[h:ab.SkillSecondChoice = pm.SkillSelectionInput(json.append(""," sk.SkillChoiceNum | 0,1,2,3,4 | Number of choices allowed | LIST | SELECT=1 "," sk.SkillChoiceText |  | Type the rules for choices to make "),json.append("","sk.SkillChoiceNum","sk.SkillChoiceText"),json.append("","ChoiceNum","ChoiceText"))]
	[h:ab.SkillsGranted = json.set(ab.SkillsGranted,"Backup",ab.SkillSecondChoice)]
};{}]

[h:macro.return = ab.SkillsGranted]