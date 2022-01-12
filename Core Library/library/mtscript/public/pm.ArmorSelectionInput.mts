[h,if(argCount()>0): ab.ExtraInput = json.toList(arg(0),"##") ; ab.ExtraInput = ""]

[h:abort(input(
	" junkVar | ---------------------- Armor Proficiency Choice Info ---------------------- |  | LABEL | SPAN=TRUE ",
	ab.ExtraInput,
	" ab.LightArmor |  | Light Armor Proficiency | CHECK ",
	" ab.MediumArmor |  | Medium Armor Proficiency | CHECK ",
	" ab.HeavyArmor |  | Heavy Armor Proficiency | CHECK ",
	" ab.Shield |  | Shield Proficiency | CHECK "
	))]
[h:ab.ArmorProfOptions = json.set("",
	"Light",ab.LightArmor,
	"Medium",ab.MediumArmor,
	"Heavy",ab.HeavyArmor,
	"Shield",ab.Shield
	)]

	[h,if(argCount()>0): ab.ExtraKeys = arg(2) ; ab.ExtraKeys = ""]
	[h,foreach(key,ab.ExtraKeys),CODE:{
		[h:ab.ArmorProfOptions = json.set(ab.ArmorProfOptions,key,eval(json.get(arg(1),roll.count)))]
	}]
	
[h:macro.return = ab.ArmorProfOptions]