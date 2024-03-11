[h:EffectData = arg(0)]
[h:incompleteEffects = data.getData("addon:","pm.a5e.core","gd.Effects")]

[h:tempTargetList = json.get(EffectData,"Targets")]
[h,if(json.type(tempTargetList)=="ARRAY"):
	targetList = json.difference(tempTargetList,"['']");
	targetList = tempTargetList
]
[h:UnlistedTargetTest = json.length(tempTargetList) != json.length(targetList)]
[h:targetName = ""]

[h:TargetNameArray = "[]"]
[h,foreach(tempTarget,targetList),CODE:{
	[h,if(json.type(tempTarget)!="OBJECT"),CODE:{
		[h:targetStillAvailable = json.contains(getTokens("json"),tempTarget)]
		[h,if(targetStillAvailable):
			TargetNameArray = json.append(TargetNameArray,if(json.get(EffectData,"ParentToken") == tempTarget,"Self",getName(tempTarget)));
			TargetNameArray = json.append(TargetNameArray,"")
		]
	};{
		[h:ItemHolder = json.get(tempTarget,"HeldBy")]
		[h,if(ItemHolder != ""): TargetNameArray = json.append(TargetNameArray,getName(ItemHolder))]
	}]
}]
[h:PriorTargetTest = json.length(TargetNameArray) != json.length(targetList)]
[h:TargetNameArray = json.difference(TargetNameArray,"['']")]

[h,if(UnlistedTargetTest): TargetNameArray = json.append(TargetNameArray,"Unspecified Target")]
[h,if(PriorTargetTest): TargetNameArray = json.append(TargetNameArray,"Prior Target")]

[h:targetName = pm.a5e.CreateDisplayList(TargetNameArray,"and")]
[h,if(length(targetName) > 50): targetName = "Multiple Targets"]

[h,if(json.get(EffectData,"ParentToken")==""),CODE:{
	[h:parentName = "World"]
};{
	[h:parentStillAvailable = json.contains(getTokens("json"),json.get(EffectData,"ParentToken"))]
	[h,if(parentStillAvailable):
		parentName = getName(json.get(EffectData,"ParentToken"));
		parentName = "Removed Token"
	]
}]

[h:EffectsToResolve = json.get(EffectData,"ToResolve")]
[h,if(json.get(EffectsToResolve,"CheckDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(EffectsToResolve,"CheckDC"),"ChecksMade")),"Checks",""); em.SecondPassDisplay = ""]
[h,if(json.get(EffectsToResolve,"SaveDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(EffectsToResolve,"SaveDC"),"SavesMade")),listAppend(em.SecondPassDisplay,"Saves"),em.SecondPassDisplay)]
[h:em.SecondPassDisplay = pm.a5e.CreateDisplayList(em.SecondPassDisplay,"and")]
[h,if(em.SecondPassDisplay!=""):
	em.SecondPassDisplay = em.SecondPassDisplay+" Made";
	em.SecondPassDisplay = "Unresolved"
]

[h:LinkedEffectNumber = json.length(json.path.read(incompleteEffects,"\$[*][?(@.ParentSubeffect == '"+json.get(EffectData,"ID")+"')]"))]
[h,if(LinkedEffectNumber > 0): em.SecondPassDisplay = em.SecondPassDisplay+ "<br>" + LinkedEffectNumber + " Linked Effect"+if(LinkedEffectNumber==1,"","s")]

[h:InvolvedTokensDisplay = if(targetName=="Self",parentName+" (self)",parentName+" vs. "+targetName)]

[h:"<!-- TODO: Add more info, e.g. ParentToken's SpellName vs. Targets --> "]
[h:em.EffectDisplay = InvolvedTokensDisplay]

[h:EffectReturnData = json.set("",
	"ParentTokenName",parentName,
	"TargetArray",TargetNameArray,
	"TargetList",targetName,
	"StatusDisplay",em.SecondPassDisplay,
	"EffectDisplay",em.EffectDisplay
)]
[h:return(0,EffectReturnData)]