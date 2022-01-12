[h:ab.SavesGranted = pm.SaveSelectionInput(json.append(""," sk.SaveAlreadyProf | No Alternative Gained,Choose Another Save,Grant Expertise | Behavior if player already has this proficiency | LIST "),json.append("","sk.SaveAlreadyProf"),json.append("","AlreadyProf"))]
[h:ab.ReselectionTest = json.get(ab.SavesGranted,"AlreadyProf")]
	
[h,if(ab.ReselectionTest==1),CODE:{
	[h:ab.SaveSecondChoice = pm.SaveSelectionInput(json.append(""," sk.SaveChoiceNum | 0,1,2,3,4 | Number of choices allowed | LIST | SELECT=1 "," sk.SaveChoiceText |  | Type the rules for choices to make "),json.append("","sk.SaveChoiceNum","sk.SaveChoiceText"),json.append("","ChoiceNum","ChoiceText"))]
	[h:ab.SavesGranted = json.set(ab.SavesGranted,"Backup",ab.SaveSecondChoice)]
};{}]
	
[h:macro.return = ab.SavesGranted]