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

[h:AdjustPriorRollsHow = json.get(tempInstance,"ModifyHow")]
[h,switch(AdjustPriorRollsHow),CODE:
    case "MinimumRoll":{
        [h:MinimumRoll = json.get(AdjustPriorRollsHow,"Value")]
        [h:ModifiedDamage = ModifiablePriorDamage]
        [h,foreach(damageInstance,ModifiedDamage),CODE:{
            [h:"<!-- Could do json.path here instead of loops -->"]
            [h:tempDamageArray = json.get(damageInstance,"Array")]
            [h,foreach(tempRoll,tempDamageArray): tempDamageArray = if(MinimumRoll>tempRoll,json.set(tempDamageArray,roll.count,MinimumRoll),tempDamageArray)]
            [h:tempCritDamageArray = json.get(damageInstance,"CritArray")]
            [h,foreach(tempRoll,tempCritDamageArray): tempCritDamageArray = if(MinimumRoll>tempRoll,json.set(tempCritDamageArray,roll.count,MinimumRoll),tempCritDamageArray)]
            [h:ModifiedDamage = json.set(ModifiedDamage,roll.count,json.set(damageInstance,"Array",tempDamageArray,"CritArray",tempCritDamageArray))]
        }]
    };
    case "MaximumRoll":{
        [h:MaximumRoll = json.get(AdjustPriorRollsHow,"Value")]
        [h:ModifiedDamage = ModifiablePriorDamage]
        [h,foreach(damageInstance,ModifiedDamage),CODE:{
            [h:tempDamageArray = json.get(damageInstance,"Array")]
            [h,foreach(tempRoll,tempDamageArray): tempDamageArray = if(MaximumRoll<tempRoll,json.set(tempDamageArray,roll.count,MaximumRoll),tempDamageArray)]
            [h:tempCritDamageArray = json.get(damageInstance,"CritArray")]
            [h,foreach(tempRoll,tempCritDamageArray): tempCritDamageArray = if(MaximumRoll<tempRoll,json.set(tempCritDamageArray,roll.count,MaximumRoll),tempCritDamageArray)]
            [h:ModifiedDamage = json.set(ModifiedDamage,roll.count,json.set(damageInstance,"Array",tempDamageArray,"CritArray",tempCritDamageArray))]
        }]
    };
    case "Reroll":{
        [h:"<!-- Reroll options: Method (lowest, highest, choice, all below X, all above X, choose below/above X), Number (All, set number, up to a certain number - requires choice) -->"]
        [h:"<!-- Possibly do 'choice' by making an array with 0/1 for reroll/don't reroll; 0s set by either not eligible or not chosen -->"]
        [h:"<!-- Only need this reroll stuff and adjusting the strings for min/max rolls. Maybe change min/max to json.path. Will likely want to make a table line for rerolls at the very least. -->"]     
    };
    case "ChangeDamageType":{
        [h:ModifiedDamage = json.path.set(ModifiablePriorDamage,"[*]['DamageType']",json.get(AdjustPriorRollsHow,"DamageType"))]
    };
    case "UseMaxRoll":{
        [h:ModifiedDamage = ModifiablePriorDamage]
        [h,foreach(damageInstance,ModifiedDamage),CODE:{
            [h:tempNewString = json.toList(json.get(damageInstance,"Dice")," + ")]
            [h,if(json.get(damageInstance,"CritDice")!=""):
                NewCritString = tempNewString+json.toList(json.get(damageInstance,"CritDice")," + ")+pm.PlusMinus(json.get(damageInstance,"Bonus"),1);
                NewCritString = ""
            ]
            [h:NewString = tempNewString+pm.PlusMinus(json.get(damageInstance,"Bonus"),1)]
            [h:ModifiedDamage = json.set(ModifiedDamage,roll.count,json.set(damageInstance,
                "Array",json.get(damageInstance,"Dice"),
                "CritArray",json.get(damageInstance,"CritDice"),
                "String",NewString,
                "CritString",NewCritString
            ))]
        }]
    };
    case "AddDamage":{
        [h:DamageInstanceToAdd = json.get(AdjustPriorRollsHow,"DamageInstance")]

        [h:UntypedTest = json.get(DamageInstanceToAdd,"DamageType") == "Untyped"]
        [h,if(UntypedTest),CODE:{
            [h:NewDamageType = json.path.read(PriorDamage,"[*][?(@.PrimaryDamageType == 1)]['DamageType']","DEFAULT_PATH_LEAF_TO_NULL")]
            [h,if(json.isEmpty(NewDamageType)): 
                NewDamageType = json.get(json.get(PriorDamage,0),"DamageType");
                NewDamageType = json.get(NewDamageType,0)
            ]
            [h:PriorDamage = json.append(PriorDamage,json.set(DamageInstanceToAdd,"DamageType",NewDamageType))]
        };{
            [h:PriorDamage = json.append(PriorDamage,DamageInstanceToAdd)]
        }]
        
        [h:ModifiedDamage = "[]"]
    }
]

[h:"<!-- Set PriorDamage here so restarting the loop is based on the changes made so far. -->"]