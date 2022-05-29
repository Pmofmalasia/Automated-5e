[h,if(argCount()>0),CODE:{
	[h:extraTopLines = json.get(arg(0),"ExtraTop")]
	[h:extraBottomLines = json.get(arg(0),"ExtraBottom")]
};{
	[h:extraTopLines = ""]
	[h:extraBottomLines = ""]
}]

[h:abort(input(
	" throwaway | ---------------------------------------------- Object Targeting Data --------------------------------------------- |  | LABEL | SPAN=TRUE ",
	"objectType | Any,Equipment,Items,Weapons,Armor,Shields,Ammunition,Casting Foci,Clothing,Accessories,Tools,Food | General Type of Object | RADIO | VALUE=STRING "
))]

[h,switch(objectType),CODE:
	case "Any":{
	
	};
	case "Equipment":{
	
	};
	case "Items":{
	
	};
	case "Weapons":{
	
	};
	case "Armor":{
	
	};
	case "Shields":{
	
	};
	case "Ammunition":{
	
	};
	case "Casting Foci":{
	
	};
	case "Clothing":{
	
	};
	case "Accessories":{
	
	};
	case "Tools":{
	
	};
	case "Food":{
	
	}
]

[h:abort(input(
	"throwaway|---------------------------------------------- Object Targeting Data ---------------------------------------------||LABEL|SPAN=TRUE",
	extraTopLines,
	"throwaway|------------------------------------------------------ Object Type -----------------------------------------------------||LABEL|SPAN=TRUE",
	" creaturesInclusiveExclusive | All (Ignore Selections),Inclusive,Exclusive | <html><span title='Inclusive = Only checked boxes are valid targets. Exclusive = Checked boxes are NOT valid targets, but all others are.'>Below Selections that Are Valid Targets</span></html> | LIST ",
	disValidCreatures,
	"throwaway|------------------------------------------------------ Object Material -----------------------------------------------------||LABEL|SPAN=TRUE",
	"throwaway|------------------------------------------------------ Object Properties -----------------------------------------------------||LABEL|SPAN=TRUE",
	"throwaway|-------------------------------------------------- Miscellaneous Object Data -------------------------------------------------||LABEL|SPAN=TRUE",
	" reqMagical | No,Yes,Not Relevant | Can Object Be Magical | LIST | SELECT=2 ",
	" reqWornCarried | No,Yes,Not Relevant | Can Object Be Worn or Carried | LIST | SELECT=2 ",
	" reqAttunement | No,Yes,Not Relevant | Can Object Require Attunement | LIST | SELECT=2 ",
	" reqProf | No,Yes,Not Relevant | Requires Proficiency with Object | LIST | SELECT=2 ",
	" rarityMin | Not Relevant,Common,Uncommon,Rare,Very Rare,Legendary,Artifact | Minimum Object Rarity | LIST | VALUE=STRING ",
	" rarityMax | Not Relevant,Common,Uncommon,Rare,Very Rare,Legendary,Artifact | Maximum Object Rarity | LIST | VALUE=STRING ",
	" weightMax | -- Ignore/Blank if None -- | Maximum Weight of Object ",
	" weightMin | -- Ignore/Blank if None -- | Minimum Weight of Object ",
	" costMax | -- Ignore/Blank if None -- | Maximum Cost of Object ",
	" costMin | -- Ignore/Blank if None -- | Minimum Cost of Object "
	extraBottomLines
))]
