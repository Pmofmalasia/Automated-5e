[h:AddXPData = macro.args]
[h:tokensReceivingXP = json.get(AddXPData,"Tokens")]
[h:XPAmount = json.get(AddXPData,"XP")]
[h:abilityTable = "[]"]

[h:tokenNumber = json.length(tokensReceivingXP)]
[h:finalXPAmount = floor(XPAmount/tokenNumber)]
[h:endXPValues = "[]"]
[h:tokenNames = "[]"]
[h:levelUpTable = data.getData("addon:","pm.a5e.core","gd.ExperienceTable")]
[h:levelUpTest = 0]
[h:leveledUpTokens = "[]"]
[h,foreach(token,tokensReceivingXP),CODE:{
	[h:newXP = getProperty("a5e.stat.Experience",token) + finalXPAmount]
	[h:setProperty("a5e.stat.Experience",newXP,token)]

	[h:currentLevel = getProperty("a5e.stat.Level",token)]
	[h:maxLevelTest = currentLevel >= json.length(levelUpTable)]
	[h,if(!maxLevelTest): nextLevelTarget = json.get(levelUpTable,currentLevel); nextLevelTarget = ""]
	[h,if(newXP >= nextLevelTarget): leveledUpTokens = json.append(leveledUpTokens,json.set("","Name",getName(token),"Level",currentLevel + 1))]

	[h:endXPValues = json.append(endXPValues,newXP)]
	[h:tokenNames = json.append(tokenNames,getName(token))]
}]

[h:isXPEqual = json.length(json.unique(endXPValues)) == 1]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Experience Gained",
	"FalseHeader","",
	"FullContents",XPAmount+"; "+finalXPAmount+" per character.",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Characters Receiving Experience",
	"FalseHeader","",
	"FullContents",pm.a5e.CreateDisplayList(tokenNames,"and"),
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:returnData = "{}"]
[h,if(isXPEqual),CODE:{
	[h,if(json.isEmpty(leveledUpTokens)),CODE:{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Experience for Next Level",
			"FalseHeader","",
			"FullContents",newXP+" <b>/</b> "+nextLevelTarget,
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
		[h:returnData = json.set(returnData,"isLevelUp",0)]
	};{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Level Up!",
			"FalseHeader","",
			"FullContents","Level "+(currentLevel+1)+" reached!",
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
		[h:returnData = json.set(returnData,"isLevelUp",1)]
	}]
};{
	[h,if(json.isEmpty(leveledUpTokens)),CODE:{

		[h:returnData = json.set(returnData,"isLevelUp",0)]
	};{
		[h:leveledUpNames = pm.a5e.CreateDisplayList(json.path.read(leveledUpTokens,"\$[*]['Name']"),"and")]
		[h:returnData = json.set(returnData,"isLevelUp",1)]
	}]
}]

[h:returnData = json.set(returnData,"Table",abilityTable)]
[h:return(0,returnData)]