[h:SpellData = pm.a5e.GetSpecificSpell(json.get(macro.args,"Spell"))]
[h:NonSpellData = json.remove(macro.args,"Spell")]
[h:ParentToken = json.get(NonSpellData,"ParentToken")]
[h:IsTooltip = 1]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Spell"]

[h:SpellName = json.get(SpellData,"Name")]
[h:SpellDisplayName = json.get(SpellData,"DisplayName")]
[h:SpellLevel = json.get(SpellData,"Level")]
[h:SpellSchool = json.get(SpellData,"School")]
[h:ForcedClass = json.get(NonSpellData,"ForcedClass")]
[h:isRitualTest = json.contains(json.path.read(SpellData,"[*]['isRitual']"),1)]
[h:IsCantrip = (SpellLevel == 0)]
[h,if(IsCantrip):
	SpellTitle = SpellDisplayName+": "+pm.GetDisplayName(SpellSchool,"sb.SpellSchools")+" Cantrip";
	SpellTitle = SpellDisplayName+": Level "+SpellLevel+" "+pm.GetDisplayName(SpellSchool,"sb.SpellSchools")+" Spell"+if(isRitualTest," (ritual)","")
]

[h:"<!-- Note: The below is the first entry in abilityTable so that it can be removed in SpellTooltipBorder but present in other tables. -->"]
[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header",SpellTitle,
	"FalseHeader","",
	"FullContents","",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:UniqueCastTimes = json.unique(json.path.read(SpellData,"['Effects'][*]['UseTime']"))]
[h:UniqueCastTimeStrings = "[]"]
[h,foreach(tempTime,UniqueCastTimes): UniqueCastTimeStrings = json.append(UniqueCastTimeStrings,json.get(tempTime,"Value")+" "+json.get(tempTime,"Units")+if(json.get(tempTime,"Value")==1,"","s"))]
[h:CastTimeDisplay = pm.a5e.CreateDisplayList(UniqueCastTimeStrings,"or")]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Casting Time",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",CastTimeDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:UniqueReactionDescriptions = json.unique(json.path.read(SpellData,"['Effects'][*]['ReactionDescription']"))]
[h:UniqueReactionDescriptionStrings = "[]"]
[h,foreach(tempTrigger,UniqueReactionDescriptions): UniqueReactionDescriptionStrings = json.append(UniqueReactionDescriptionStrings,base64.decode(tempTrigger))]
[h:ReactionDescriptionDisplay = upper(pm.a5e.CreateDisplayList(UniqueReactionDescriptionStrings,"or"),1)]
[h,if(ReactionDescriptionDisplay != ""): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Reaction Trigger",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",ReactionDescriptionDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:isConcentrationTest = json.contains(json.path.read(SpellData,"['Effects'][*]['isConcentration']"),1)]
[h:ConcentrationLost = json.path.read(SpellData,"['Effects'][*]['ConcentrationLost']")]
[h,if(!json.isEmpty(ConcentrationLost)): 
    ConcentrationLostString = ", no longer required at level "+json.get(ConcentrationLost,0);
    ConcentrationLostString = ""
]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Requires Concentration",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(isConcentrationTest,"Yes","No")+ConcentrationLostString,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]


[h:sComp = json.contains(SpellData,"sComp")]
[h:vComp = json.contains(SpellData,"vComp")]
[h:mComp = json.contains(SpellData,"mComp")]
[h,if(mComp),CODE:{
    [h:tempComponents = json.get(SpellData,"mComponents")]
    [h,if(json.isEmpty(tempComponents)):
        materialComponents = "";
        materialComponents = base64.decode(json.get(tempComponents,0))
    ]
    [h:tempConsumedComponents = json.get(SpellData,"mComponentsConsumed")]
    [h,if(json.isEmpty(tempConsumedComponents)):
        materialComponentsConsumed = "";
        materialComponentsConsumed = base64.decode(json.get(tempConsumedComponents,0))
    ]
};{
    [h:componentsDisplay = ""]
    [h:materialComponents = ""]
    [h:materialComponentsConsumed = ""]
}]

[h:componentsDisplay = if(vComp,"V","")]
[h:componentsDisplay = if(sComp,listAppend(componentsDisplay,"S",", "),componentsDisplay)]
[h:componentsDisplay = if(mComp,listAppend(componentsDisplay,"M"+if(materialComponents==""," (consumed)"," ("+materialComponents+")"),", "),componentsDisplay)]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Components",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",componentsDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(materialComponentsConsumed != ""): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Components Consumed",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",materialComponentsConsumed,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:UniqueDurations = json.unique(json.path.read(SpellData,"['Effects'][*]['Duration']"))]
[h:UniqueDurationStrings = ""]
[h,foreach(tempTime,UniqueDurations): UniqueDurationStrings = json.append(UniqueDurationStrings,if(json.isEmpty(tempTime),"Instantaneous",json.get(tempTime,"Value")+" "+json.get(tempTime,"Units")+if(json.get(tempTime,"Value")==1,"","s")))]
[h:DurationDisplay = pm.a5e.CreateDisplayList(UniqueDurationStrings,"or")]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Duration",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",DurationDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:SpellDescription = base64.decode(json.get(SpellData,"Description"))]
[h:SpellAHLDescription = base64.decode(json.get(SpellData,"AHLDescription"))]
[h:CompleteSpellDescription = SpellDescription+if(SpellAHLDescription=="","","<br><br>"+if(IsCantrip,"","<b><i>At Higher Levels.</b></i> "))+SpellAHLDescription]

[h:macro.return = json.set("","Table",abilityTable,"Source","Arcane","Description",CompleteSpellDescription,"DisplayName",SpellTitle)]