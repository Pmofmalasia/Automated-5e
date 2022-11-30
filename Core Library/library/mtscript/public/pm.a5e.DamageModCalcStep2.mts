[h:hp.Data = arg(0)]
[h:modifierInstance = arg(1)]
[h:hp.Source = json.get(hp.Data,"SourceType")]
[h:switchToken(json.get(hp.Data,"ParentToken"))]

[h:AllSourcesTest = if(json.get(modifierInstance,"All")==1,1,0)]
	
[h,if(AllSourcesTest),CODE:{
	[h:macro.return = json.get(modifierInstance,"DamageTypes")]
};{
	[h,if(json.get(modifierInstance,"SourceToken")==""): SpecificTokenTest = 1; SpecificTokenTest = if(json.get(hp.Data,"SourceToken")=="",0,json.contains(json.get(modifierInstance,"SourceToken"),json.get(hp.Data,"SourceToken")))]
	[h,if(json.get(modifierInstance,"ExcludeSourceToken")==""): ExcludeTokenTest = 1; ExcludeTokenTest = if(json.get(hp.Data,"SourceToken")=="",1,!json.contains(json.get(modifierInstance,"ExcludeSourceToken"),json.get(hp.Data,"SourceToken")))]
	[h,if(json.get(modifierInstance,"IncludeCreatureType")==""): CreatureTypeTest = 1; CreatureTypeTest = if(json.get(hp.Data,"")=="SourceToken",0,json.contains(json.get(modifierInstance,"IncludeCreatureType"),getProperty("a5e.stat.CreatureType",json.get(hp.Data,"SourceToken"))))]
	[h,if(json.get(modifierInstance,"ExcludeCreatureType")==""): ExcludeCreatureTypeTest = 1; ExcludeCreatureTypeTest = if(json.get(hp.Data,"SourceToken")=="",1,!json.contains(json.get(modifierInstance,"ExcludeCreatureType"),getProperty("a5e.stat.CreatureType",json.get(modifierInstance,"SourceToken"))))]
	[h,if(json.get(modifierInstance,"HasCondition")==""): HasConditionTest = 1; HasConditionTest = if(json.get(hp.Data,"SourceToken")=="",0,!json.isEmpty(json.intersection(json.get(modifierInstance,"HasCondition"),json.path.read(getProperty("a5e.stat.ConditionList",json.get(modifierInstance,"SourceToken")),"[*]['Name']"))))]
	[h,if(json.get(modifierInstance,"IncludeMorality")==""): IncludeMoralityTest = 1; IncludeMoralityTest = if(json.get(hp.Data,"SourceToken")=="",0,json.contains(json.get(modifierInstance,"IncludeMorality"),json.get(getProperty("a5e.stat.Alignment",json.get(modifierInstance,"SourceToken")),"Morality")))]
	[h,if(json.get(modifierInstance,"ExcludeMorality")==""): ExcludeMoralityTest = 1; ExcludeMoralityTest = if(json.get(hp.Data,"SourceToken")=="",1,!json.contains(json.get(modifierInstance,"ExcludeMorality"),json.get(getProperty("a5e.stat.Alignment",json.get(modifierInstance,"SourceToken")),"Morality")))]
	[h,if(json.get(modifierInstance,"IncludeOrder")==""): IncludeOrderTest = 1; IncludeOrderTest = if(json.get(hp.Data,"SourceToken")=="",0,json.contains(json.get(modifierInstance,"IncludeOrder"),json.get(getProperty("a5e.stat.Alignment",json.get(modifierInstance,"SourceToken")),"Order")))]
	[h,if(json.get(modifierInstance,"ExcludeOrder")==""): ExcludeOrderTest = 1; ExcludeOrderTest = if(json.get(hp.Data,"SourceToken")=="",1,!json.contains(json.get(modifierInstance,"ExcludeOrder"),json.get(getProperty("a5e.stat.Alignment",json.get(modifierInstance,"SourceToken")),"Order")))]
	
	[h,switch(hp.Source),CODE:
	case "Spell":{
		[h:MagicSourcesTest = if(json.get(modifierInstance,"Magical")==0,0,1)]
		[h,if(json.get(modifierInstance,"IncludeSchool")==""): IncludeSchoolTest = 1; IncludeSchoolTest = json.contains(json.get(modifierInstance,"IncludeSchool"),json.get(hp.Data,"School"))]
		[h,if(json.get(modifierInstance,"ExcludeSchool")==""): ExcludeSchoolTest = 1; ExcludeSchoolTest = !json.contains(json.get(modifierInstance,"ExcludeSchool"),json.get(hp.Data,"School"))]
		[h:SpecificSourceTest = min(MagicSourcesTest,IncludeSchoolTest,ExcludeSchoolTest)]
		
	};
	case "Weapon":{
		[h:MeleeRangedTest = or(json.get(modifierInstance,"MeleeRanged")=="",json.get(modifierInstance,"MeleeRanged") == json.get(hp.Data,"MeleeRanged"))]
		[h:MagicSourcesTest = or(json.get(modifierInstance,"Magical")=="",json.get(modifierInstance,"Magical") == json.get(hp.Data,"Magical"))]
		[h,if(json.get(modifierInstance,"IncludeMaterial")==""): IncludeMaterialTest = 1; IncludeMaterialTest = json.contains(json.get(modifierInstance,"IncludeMaterial"),json.get(hp.Data,"Material"))]
		[h,if(json.get(modifierInstance,"ExcludeMaterial")==""): ExcludeMaterialTest = 1; ExcludeMaterialTest = !json.contains(json.get(modifierInstance,"ExcludeMaterial"),json.get(hp.Data,"Material"))]
		[h:SpecificSourceTest = min(MeleeRangedTest,MagicSourcesTest,IncludeMaterialTest,ExcludeMaterialTest)]
	};
	default:{
		[h:SpecificSourceTest = 1]
	}
	]
	
	[h:hp.TempDmgModTest = and(SpecificSourceTest,ExcludeOrderTest,IncludeOrderTest,ExcludeMoralityTest,IncludeMoralityTest,HasConditionTest,ExcludeCreatureTypeTest,CreatureTypeTest,ExcludeTokenTest,SpecificTokenTest)]
	
	[h,if(hp.TempDmgModTest): macro.return = json.get(modifierInstance,"DamageTypes"); macro.return = "[]"]
}]