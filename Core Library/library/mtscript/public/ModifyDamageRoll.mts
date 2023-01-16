[h:EffectToModifyData = arg(0)]
[h:ModifyHowData = arg(1)]

[h:EffectID = json.get(EffectToModifyData,"ID")]
[h:EffectToModify = json.path.read(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+EffectID+")]")]
[h,if(json.isEmpty(EffectToModify)):
    return(0);
    EffectToModify = json.get(EffectToModify,0)
]

[h:HasPriorDamageTest = !json.get(EffectToModify,"ToResolve") == ""]
[h,if(HasPriorDamageTest),CODE:{
    [h:HasPriorDamageTest2 = !json.get(json.get(EffectToModify,"ToResolve"),"Damage") == ""]
    [h,if(HasPriorDamageTest2)
        PriorDamage = json.get(json.get(EffectToModify,"ToResolve"),"Damage");
        PriorDamage = "[]"
    ]
};{
    [h:PriorDamage = "[]"]
}]

[h,if(json.type(ModifyHowData) == "OBJECT"): ModifyHowData = json.append("",ModifyHowData)]

[h,foreach(tempInstance,ModifyHowData),CODE:{
    [h:ModifyFilterData = json.get(tempInstance,"Filters")]
    [h,if(ModifyFilterData == ""),CODE:{
        [h:ModifiablePriorDamage = PriorDamage]
    };{
        [h:ModifyFilter = ""]
        [h,if(json.get(ModifyFilterData,"DamageTypeInclusive")!=""): ModifyFilter = listAppend(ModifyFilter,"@.DamageType in "+json.get(ModifyFilterData,"DamageTypeInclusive")," && ")]
        [h,if(json.get(ModifyFilterData,"DamageTypeExclusive")!=""): ModifyFilter = listAppend(ModifyFilter,"@.DamageType nin "+json.get(ModifyFilterData,"DamageTypeExclusive")," && ")]
        [h,if(json.get(ModifyFilterData,"IsWeaponDamage")!=""): ModifyFilter = listAppend(ModifyFilter,"@.IsWeapon == "+json.get(ModifyFilterData,"IsWeaponDamage")+"'"," && ")]
        [h,if(json.get(ModifyFilterData,"IsSpellDamage")!=""): ModifyFilter = listAppend(ModifyFilter,"@.IsSpell == '"+json.get(ModifyFilterData,"IsSpellDamage")+"'"," && ")]
        [h,if(ModifyFilter==""):
            ModifiablePriorDamage = PriorDamage;
            ModifiablePriorDamage = json.path.read(PriorDamage,"[*][?("+ModifyFilter+")]")
        ]
    }]

    [h:AdjustPriorRollsHow = json.get(tempInstance,"ModifyRoll")]
    [h,if(AdjustPriorRollsHow != ""),CODE:{
        [h:MinimumRoll = json.get(AdjustPriorRollsHow,"MinimumRoll")]
        [h:MaximumRoll = json.get(AdjustPriorRollsHow,"MaximumRoll")]
        [h:RerollAll = json.get(AdjustPriorRollsHow,"RerollAll")]
        [h:"<!-- Reroll options: Method (lowest, highest, choice, all below X, all above X, choose below/above X), Number (All, set number, up to a certain number - requires choice) -->"]
        [h:NewDamageType = json.get(AdjustPriorRollsHow,"ChangeDamageType")]
        [h:UseMaxRoll = json.get(AdjustPriorRollsHow,"UseMaxRoll")]
    };{
        [h:MinimumRoll = ""]
        [h:MaximumRoll = ""]
        [h:RerollAll = ""]
        [h:NewDamageType = ""]
        [h:UseMaxRoll = ""]
    }]

    [h:ModifiedDamage = ModifiablePriorDamage]
    [h,if(isNumber(MinimumRoll)),foreach(damageInstance,ModifiedDamage),CODE:{
        [h:tempDamageArray = json.get(damageInstance,"Array")]
        [h,foreach(tempRoll,tempDamageArray): tempDamageArray = if(MinimumRoll>tempRoll,json.set(tempDamageArray,roll.count,MinimumRoll),tempDamageArray)]
        [h:tempCritDamageArray = json.get(damageInstance,"CritArray")]
        [h,foreach(tempRoll,tempCritDamageArray): tempCritDamageArray = if(MinimumRoll>tempRoll,json.set(tempCritDamageArray,roll.count,MinimumRoll),tempCritDamageArray)]
        [h:ModifiedDamage = json.set(ModifiedDamage,roll.count,json.set(damageInstance,"Array",tempDamageArray,"CritArray",tempCritDamageArray))]
    }]

    [h,if(isNumber(MaximumRoll)),foreach(damageInstance,ModifiedDamage),CODE:{
        [h:tempDamageArray = json.get(damageInstance,"Array")]
        [h,foreach(tempRoll,tempDamageArray): tempDamageArray = if(MaximumRoll<tempRoll,json.set(tempDamageArray,roll.count,MaximumRoll),tempDamageArray)]
        [h:tempCritDamageArray = json.get(damageInstance,"CritArray")]
        [h,foreach(tempRoll,tempCritDamageArray): tempCritDamageArray = if(MaximumRoll<tempRoll,json.set(tempCritDamageArray,roll.count,MaximumRoll),tempCritDamageArray)]
        [h:ModifiedDamage = json.set(ModifiedDamage,roll.count,json.set(damageInstance,"Array",tempDamageArray,"CritArray",tempCritDamageArray))]
    }]

    [h,if(NewDamageType!=""): ModifiedDamage = json.path.set(ModifiedDamage,"[*]['DamageType']",NewDamageType)]
}]

[{"Array":[4,8,2,7],"Total":21,"String":"4 + 8 + 2 + 7","MaxTotal":32,"Dice":[8,8,8,8],"Bonus":0,"Formula":"4d8","DamageType":"Cold","NoModification":0,"IsWeapon":0,"IsSpell":0,"Modifier":1}]

[{"IsSpell":0,"IsWeapon":1,"IsAttack":1,"Modifier":1,"ScalingBase":0,"Array":[5,2],"Total":10,"String":"5 + 2 + 3","MaxTotal":15,"Dice":[6,6],"Bonus":3,"Formula":"2d6 + Str","CritFormula":"2d6 + 2d6 + Str","CritDice":[6,6],"CritArray":[5,2,2,5],"CritString":"5 + 2 + 2 + 5 + 3","CritTotal":17,"CritMaxTotal":15,"DamageType":"Slashing","NoModification":0,"UseCrit":0}]