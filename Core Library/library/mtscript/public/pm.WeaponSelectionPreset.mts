[h:ab.WeaponsGranted = pm.WeaponSelectionInput(json.append(""," sk.WeaponAlreadyProf | No Alternative Gained,Choose Another Weapon | Behavior if player already has this proficiency | LIST "),json.append("","sk.WeaponAlreadyProf"),json.append("","AlreadyProf"))]
[h:ab.ReselectionTest = json.get(ab.WeaponsGranted,"AlreadyProf")]
		
[h,if(ab.ReselectionTest==1),CODE:{
	[h:ab.WeaponSecondChoice = pm.WeaponSelectionInput(json.append(""," sk.WeaponChoiceNum | 0,1,2,3,4 | Number of choices allowed | LIST | SELECT=1 "," sk.WeaponChoiceText |  | Type the rules for choices to make "),json.append("","sk.WeaponChoiceNum","sk.WeaponChoiceText"),json.append("","ChoiceNum","ChoiceText"))]
	[h:ab.WeaponsGranted = json.set(ab.WeaponsGranted,"Backup",ab.WeaponSecondChoice)]
};{}]

[h:macro.return = ab.WeaponsGranted]