[h:TransformFilterFeaturesData = macro.args]
[h:NewOrOld = json.get(TransformFilterFeaturesData,"NewOrOld")]
[h:features = json.get(TransformFilterFeaturesData,"Features")]
[h:Filter = json.get(TransformFilterFeaturesData,"Filter")]

[h:safeGainedFeatures = "[]"]
[h,if(!json.contains(Filter,"LegendaryActions")):
	features = json.path.read(features,"\$[*][?(@.Master != 'LegendaryActions')]");
	safeGainedFeatures = json.path.read(features,"\$[*][?(@.Master != 'LegendaryActions')]")
]

[h,if(!json.contains(Filter,"LairActions")):
	features = json.path.read(features,"\$[*][?(@.Master != 'LairActions')]");
	safeGainedFeatures = json.merge(safeGainedFeatures,json.path.read(features,"\$[*][?(@.Master != 'LairActions')]"))
]

[h,if(!json.contains(Filter,"LegendaryResistances")):
	features = json.path.read(features,"\$[*][?(@.Name != 'LegendaryResistance')]");
	safeGainedFeatures = json.merge(safeGainedFeatures,json.path.read(features,"\$[*][?(@.Name != 'LegendaryResistance')]"))
]

[h,if(!json.contains(Filter,"Spellcasting") && !json.contains(Filter,"InnateSpellcasting")),CODE:{
	[h:features = json.path.read(features,"\$[*][?(@.CallSpellClass == null)]","DEFAULT_PATH_LEAF_TO_NULL")]
};{
	[h,if(json.contains(Filter,"Spellcasting") && json.contains(Filter,"InnateSpellcasting")),CODE:{
		[h:safeGainedFeatures = json.merge(safeGainedFeatures,json.path.read(features,"\$[*][?(@.CallSpellClass != null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
	};{
		[h,if(!json.contains(Filter,"Spellcasting")):
			features = json.path.read(features,"\$[*][?(@.Name != 'Spellcasting')]");
			safeGainedFeatures = json.merge(safeGainedFeatures,json.path.read(features,"\$[*][?(@.Name == 'Spellcasting')]","DEFAULT_PATH_LEAF_TO_NULL"))
		]
		[h,if(!json.contains(Filter,"InnateSpellcasting")):
			features = json.path.read(features,"\$[*][?(@.Name != 'InnateSpellcasting' && (@.Class != '"+getProperty("a5e.stat.Race")+"' && @.CallSpellClass == null))]","DEFAULT_PATH_LEAF_TO_NULL");
			safeGainedFeatures = json.merge(safeGainedFeatures,json.path.read(features,"\$[*][?(@.Name == 'InnateSpellcasting' || (@.Class == '"+getProperty("a5e.stat.Race")+"' && @.CallSpellClass != null))]","DEFAULT_PATH_LEAF_TO_NULL"))
		]		
	}]
}]

[h,if(!json.contains(Filter,"Senses")),CODE:{
	[h:features = json.path.delete(features,"\$[*]['CallSenses']")]
	[h:features = json.path.delete(features,"\$[*]['CallVision']")]
};{
	[h:"<!-- Need a way to retain senses + vision ONLY from a feature without retaining other stuff that goes along with them. Possibly create new dummy feature combining all the stuff from old features -->"]
}]

[h,if(!json.contains(Filter,"Proficiencies")),CODE:{
	[h:features = json.path.delete(features,"\$[*]['Skills']")]
	[h:features = json.path.delete(features,"\$[*]['Saves']")]
	[h:features = json.path.delete(features,"\$[*]['Tools']")]
};{
	[h:"<!-- See vision above, plus need a way to check which bonus is higher between new/old -->"]
}]

[h,if(!json.contains(Filter,"OtherFeatures")): features = safeGainedFeatures]

[h,if(NewOrOld == "Old"),CODE:{
	[h:"<!-- Add in Reasonable Features and This Feature here -->"]
}]

[h:return(0,features)]