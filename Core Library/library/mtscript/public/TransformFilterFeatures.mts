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

[h,if(NewOrOld == "New"),CODE:{
	[h,if(!json.contains(Filter,"OtherFeatures")): features = safeGainedFeatures]
	[h:return(0,features)]
};{}]

[h,if(!json.contains(Filter,"OtherFeatures") && !json.contains(Filter,"ReasonableFeatures")),CODE:{
	[h:"<!-- Needs a ThisFeature check here (add to safegainedfeatures)-->"]
	[h:features = safeGainedFeatures]
	[h:return(0,features)]
};{
	[h,if(!json.contains(Filter,"ReasonableFeatures")): return(0,features)]
}]

[h:allTransformationSettings = data.getData("addon:","pm.a5e.core","a5e.settings.ReasonableTransformations")]
[h:thisFormSettings = json.get(allTransformationSettings,json.get(TransformFilterFeaturesData,"Form"))]
[h,if(thisFormSettings == ""),CODE:{
	[h:thisFormAllowedFeatureSettings = "[]"]
	[h:thisFormProhibitedFeatureSettings = "[]"]
}
	[h:thisFormFeatureSettings = json.get(thisFormSettings,"Features")]
	[h:thisFormAllowedFeatureSettings = json.get(thisFormFeatureSettings,"Allowed")]
	[h:thisFormProhibitedFeatureSettings = json.get(thisFormFeatureSettings,"Prohibited")]
]
[h:allFormSettings = json.get(allTransformationSettings,"allForms")]
[h:allFormAllowedFeatureSettings = json.get(allFormSettings,"Allowed")]
[h:allFormProhibitedFeatureSettings = json.get(allFormSettings,"Prohibited")]

[h:unsafeFeatures = json.difference(features,safeGainedFeatures)]
[h:featureChoiceInput = " junkVar | ------------ Choose Allowed Features ------------ |  | LABEL | SPAN=TRUE "]
[h:featuresWithoutChoice = ""]
[h:featureCounter = 0]
[h:featureChoiceOptions = json.append("","Allowed - All Forms","Allowed - This Form","Prohibited - All Forms","Prohibited - This Form")]
[h,foreach(feature,unsafeFeatures),CODE:{
	[h:featureIdentifier = json.set("","Name",json.get(feature,"Name"),"Class",json.get(feature,"Class"),"Subclass",json.get(feature,"Subclass"))]
	[h,if(!json.contains(thisFormAllowedFeatureSettings,featureIdentifier) && !json.contains(thisFormProhibitedFeatureSettings,featureIdentifier) && !json.contains(allFormAllowedFeatureSettings,featureIdentifier) && !json.contains(allFormProhibitedFeatureSettings,featureIdentifier)),CODE:{
		[h:featureChoiceInput = listAppend(featureChoiceInput," reasonableFeatureChoice"+featureCounter+" | "+featureChoiceOptions+" | "+json.get(feature,"DisplayName")+" | LIST | DELIMITER=JSON "," ## ")]
		[h:featuresWithoutChoice = json.append(featuresWithoutChoice,featureIdentifier)]

		[h:featureCounter = featureCounter + 1]
	};{
		[h,if(json.contains(thisFormAllowedFeatureSettings,featureIdentifier) || json.contains(allFormAllowedFeatureSettings,featureIdentifier)): safeGainedFeatures = json.append(safeGainedFeatures,feature)]
	}]
}]

[h:anyChoicesMade = json.length(featuresWithoutChoice) > 0]
[h,if(!anyChoicesMade),CODE:{
	[h:return(0,safeGainedFeatures)]
};{}]

[h:abort(input(featureChoiceInput))]

[h,foreacH(feature,featuresWithoutChoice),CODE:{
	[h:thisFeatureChoice = eval("reasonableFeatureChoice"+roll.count)]
	[h:featureIdentifier = json.set("","Name",json.get(feature,"Name"),"Class",json.get(feature,"Class"),"Subclass",json.get(feature,"Subclass"))]
	[h,switch(thisFeatureChoice),CODE:
		case 0:{
			[h:safeGainedFeatures = json.append(safeGainedFeatures,feature)]
			[h:allFormAllowedFeatureSettings = json.append(allFormAllowedFeatureSettings,featureIdentifier)]
		};
		case 1:{
			[h:safeGainedFeatures = json.append(safeGainedFeatures,feature)]
			[h:thisFormAllowedFeatureSettings = json.append(thisFormAllowedFeatureSettings,featureIdentifier)]
		};
		case 2:{
			[h:thisFormProhibitedFeatureSettings = json.append(thisFormProhibitedFeatureSettings,featureIdentifier)]
		};
		case 3:{
			[h:allFormProhibitedFeatureSettings = json.append(allFormProhibitedFeatureSettings,featureIdentifier)]
		}
	]
}]

[h:thisFormFinalData = json.set(thisFormSettings,"Allowed",thisFormAllowedFeatureSettings,"Prohibited",thisFormProhibitedFeatureSettings)]
[h:allFormsFinalData = json.set(allFormSettings,"Allowed",allFormAllowedFeatureSettings,"Prohibited",allFormProhibitedFeatureSettings)]
[h:allTransformationSettings = json.set(allTransformationSettings,json.get(TransformFilterFeaturesData,"Form"),thisFormFinalData,"allForms",allFormsFinalData)]

[h:data.setData("addon:","pm.a5e.core","a5e.settings.ReasonableTransformations",allTransformationSettings)]
[h:return(0,safegainedfeatures)]