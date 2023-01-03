[h:ab.FilterInfo = arg(0)]
[h:ab.Level = json.get(ab.FilterInfo,"Level")]
[h:ab.FilterFinal = "[r:"]

[h:abort(input(
	" junkVar | Current Filter: "+json.get(ab.FilterInfo,"Description")+" |  | LABEL | SPAN=TRUE ",
	" ab.FilterNumberType | 1,Other Flat Number,Attribute Based,Proficiency Based,Proficiency Plus Attribute Based,Linearly Class Level Based,Non-Linearly Class Level Based,Custom | Number of Spells for this Filter | LIST | VALUE=STRING "
))]
	
[h,switch(ab.FilterNumberType),CODE:
	case "1": {
		[h:ab.SecondFilterDisplay = ""]
	};
	case "Other Flat Number": {
		[h:ab.SecondFilterDisplay = " ab.FilterChoice | 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 | Amount of Filter | LIST | VALUE=STRING"]
	};
	case "Attribute Based": {
		[h:ab.SecondFilterDisplay = " ab.FilterChoice | "+pm.GetAttributes("DisplayName")+" | Choose Attribute | LIST | VALUE=STRING ## ab.MultiplierChoice | 1/4,1/3,1/2,1,2,3,4,5,6,7,8,9,10 | Filter = Attribute x | LIST | VALUE=STRING SELECT=3"]
	};
	case "Linearly Class Level Based": {
		[h:ab.SecondFilterDisplay = " ab.FilterChoice | 1/4,1/3,1/2,1,2,3,4,5,6,7,8,9,10 | Filter = Class Level x | LIST | VALUE=STRING SELECT=3"]
	};
	case "Non-Linearly Class Level Based": {
			[h:ab.SecondFilterDisplay = " junkVar | <html><span title='e.g. Rage has 2 per long rest at level 1 and 2, and 3 at level 3. 2 is input at level 1, 0 for level 2, and 1 for level 3.'>Input the amount of maximum Filter <i>gained</i> at each level</span></html> | | LABEL | SPAN=TRUE "]
			[h,foreach(tempLevel,ab.UpdateLevelOptions): ab.SecondFilterDisplay = listAppend(ab.SecondFilterDisplay," tempFilter"+tempLevel+" | 0,1,2,3,4,5,6,7,8,9,10 | Level "+tempLevel+" | LIST | VALUE=STRING ","##")]
	};
	case "Proficiency Based": {
		[h:ab.SecondFilterDisplay = " ab.FilterChoice | 1/2,1,2,3,4,5,6,7,8,9,10 | Filter = Proficiency x | LIST | VALUE=STRING SELECT=1"]
	};
	case "Proficiency Plus Attribute Based": {
		[h:ab.SecondFilterDisplay = "levelMultiplier | 0,1/4,1/2,1,2 | Multiply Level By | LIST | VALUE=STRING SELECT=3 
		## AttributeChoice | "+pm.GetAttributes("DisplayName")+" | Choose Attribute | LIST | VALUE=STRING
		## primestatMultiplier | 0,1/4,1/2,1,2 | Multiply Attribute Modifier By | LIST | VALUE=STRING SELECT=3 
		## RoundingDirection | Down,Up | Round Up or Down | LIST | VALUE=STRING "]
	};
	case "Custom": {
		[h:ab.SecondFilterDisplay = " ab.FilterChoice |  | <html><span title='Do not include the roll option, and only use double quotes. This will likely require advanced knowledge of how the code works. If you have just now realized that youre in over your head, just type a number instead.'>Type a function to calculate the amount of Filter.</span></html>"]
	}
]

[h:abort(input(ab.SecondFilterDisplay))]

[h,switch(ab.FilterNumberType),CODE:
	case "1": {
		[h:tempFilter = 1]
	};
	case "Attribute Based": {
		[h:tempFilter = "max(1,json.get(getProperty('a5e.stat.AtrMods'),'"+pm.RemoveSpecial(ab.FilterChoice)+"')"+if(ab.MultiplierChoice=="1","","*"+ab.MultiplierChoice)+")"]
	};
	case "Other Flat Number": {
		[h:tempFilter = ab.FilterChoice]
	};
	case "Linearly Class Level Based": {
		[h:tempFilter = "floor(pm.GetAbilityLevel(json.set('','Name','"+json.get(ab.FilterInfo,"Name")+"','Class','"+json.get(ab.FilterInfo,"Class")+"','Subclass','"+json.get(ab.FilterInfo,"Subclass")+"'))*"+ab.FilterChoice+")"]
	};
	case "Non-Linearly Class Level Based":{
		[h:tempFilter = eval("tempFilter"+ab.Level)]
		[h:UpdateLevelInfo = "{}"]
		[h:currentChoiceNumber = tempFilter]
		[h,count(20-ab.Level-1),CODE:{
			[h:currentLevel = (ab.Level+1+roll.count)]
			[h:tempThisLevelNumber = eval("tempFilter"+currentLevel)]
			[h:currentChoiceNumber = currentChoiceNumber + tempThisLevelNumber]
			[h:UpdateLevelInfo = if(tempThisLevelNumber!=0,json.set(UpdateLevelInfo,currentLevel,tempThisLevelNumber),UpdateLevelInfo)]
		}]
	};
	case "Proficiency Based": {
		[h:tempFilter = "getProperty('a5e.stat.Proficiency')*"+ab.FilterChoice]
	};
	case "Proficiency Plus Attribute Based": {
		[h:tempFilter = if(RoundingDirection=="Down","floor","ceiling")+"(("+levelMultiplier+")*pm.GetAbilityLevel(json.set('','Name','"+json.get(ab.FilterInfo,"Name")+"','Class','"+json.get(ab.FilterInfo,"Class")+"','Subclass','"+json.get(ab.FilterInfo,"Subclass")+"'))+("+primestatMultiplier+")*json.get(getProperty('a5e.stat.AtrMods'),'"+pm.RemoveSpecial(AttributeChoice)+"'))"]
	};
	case "Custom": {
		[h:tempFilter = ab.FilterChoice]
	};
	default: {}
]

[h:ab.FilterFinal = ab.FilterFinal+tempFilter+"]"]

[h:AllFilterData = json.set("","Base",ab.FilterFinal)]

[h,if(ab.FilterNumberType == "Non-Linearly Class Level Based"): AllFilterData = json.set(AllFilterData,"Updates",UpdateLevelInfo)]

[h:macro.return = AllFilterData]