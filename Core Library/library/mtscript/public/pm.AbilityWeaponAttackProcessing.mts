[h,if(IsTooltip),CODE:{
	[h:abilityTable = json.append(abilityTable,WeaponAttackData)]
};{
	[h:abilityTable = json.merge(abilityTable,WeaponAttackData)]
}]