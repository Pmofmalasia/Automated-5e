[h:ab.ArmorGranted = pm.ArmorSelectionInput(json.append(""," sk.ArmorAlreadyProf | No Alternative Gained,Choose Another Armor Type | Behavior if player already has this proficiency | LIST "),json.append("","sk.ArmorAlreadyProf"),json.append("","AlreadyProf"))]
[h:ab.ReselectionTest = json.get(ab.ArmorGranted,"AlreadyProf")]
	
[h,if(ab.ReselectionTest==1),CODE:{
	[h:ab.ArmorSecondChoice = pm.ArmorSelectionInput(json.append(""," sk.ArmorChoiceNum | 0,1,2,3,4 | Number of choices allowed | LIST | SELECT=1 "," sk.ArmorChoiceText |  | Type the rules for choices to make "),json.append("","sk.ArmorChoiceNum","sk.ArmorChoiceText"),json.append("","ChoiceNum","ChoiceText"))]
	[h:ab.ArmorGranted = json.set(ab.ArmorGranted,"Backup",ab.ArmorSecondChoice)]
};{}]

[h:macro.return = ab.ArmorGranted]