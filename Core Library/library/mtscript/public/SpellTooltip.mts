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

[h:abilityTable = json.merge(abilityTable,pm.a5e.GenerateFeatureTooltip(SpellData,0))]

[h:SpellDescription = base64.decode(json.get(SpellData,"Description"))]
[h:SpellAHLDescription = base64.decode(json.get(SpellData,"AHLDescription"))]
[h:CompleteSpellDescription = SpellDescription+if(SpellAHLDescription=="","","<br><br>"+if(IsCantrip,"","<b><i>At Higher Levels.</b></i> "))+SpellAHLDescription]

[h:macro.return = json.set("","Table",abilityTable,"Source","Arcane","Description",CompleteSpellDescription,"DisplayName",SpellTitle)]