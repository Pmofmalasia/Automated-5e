[h:AbilitiesWithResources = json.path.read(allAbilities,"[?(@.Resource>=0)]")]
[h:disAbilityResourceSelection = ""]
[h:temp.AbilityCount = 0]
[h,foreach(ability,AbilitiesWithResources),CODE:{
	[h:temp.MaxResource = evalMacro(json.get(ability,"MaxResource"))]
	[h:temp.MaxResource = if(json.type(temp.MaxResource)=="ARRAY",json.get(temp.MaxResource,0),temp.MaxResource)]
	[h:temp.ResourceOptions = "0"]
	[h,count(temp.MaxResource): temp.ResourceOptions = listAppend(temp.ResourceOptions,(roll.count+1),",")]
	[h:disAbilityResourceSelection = listAppend(disAbilityResourceSelection," temp.Resource"+temp.AbilityCount+" | "+temp.ResourceOptions+" | "+json.get(ability,"DisplayName")+" | LIST | SELECT="+json.get(ability,"Resource")+" ","##")]
	[h:temp.AbilityCount = temp.AbilityCount+1]
}]

[h:abort(input(
	" junkVar | Modify the amount of each ability remaining below: |  | LABEL | SPAN=TRUE ",
	disAbilityResourceSelection
	))]

[h,foreach(ability,AbilitiesWithResources),CODE:{
	[h:allAbilities=json.path.set(allAbilities,"[?(@.Name=='"+json.get(ability,"Name")+"')]['Resource']",eval("temp.Resource"+roll.count))]
}]