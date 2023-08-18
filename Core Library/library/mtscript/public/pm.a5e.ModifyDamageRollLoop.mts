[h:ModifyFilterData = json.get(tempInstance,"Filters")]
[h,if(ModifyFilterData == ""),CODE:{
    [h:ModifiablePriorDamage = PriorDamage]
};{
    [h:ModifyFilter = ""]
    [h,if(json.get(ModifyFilterData,"DamageTypeInclusive")!=""): ModifyFilter = listAppend(ModifyFilter,"@.DamageType in "+json.get(ModifyFilterData,"DamageTypeInclusive")," && ")]
    [h,if(json.get(ModifyFilterData,"DamageTypeExclusive")!=""): ModifyFilter = listAppend(ModifyFilter,"@.DamageType nin "+json.get(ModifyFilterData,"DamageTypeExclusive")," && ")]
    [h,if(json.get(ModifyFilterData,"IsWeaponDamage")!=""): ModifyFilter = listAppend(ModifyFilter,"@.IsWeapon == '"+json.get(ModifyFilterData,"IsWeaponDamage")+"'"," && ")]
    [h,if(json.get(ModifyFilterData,"IsSpellDamage")!=""): ModifyFilter = listAppend(ModifyFilter,"@.IsSpell == '"+json.get(ModifyFilterData,"IsSpellDamage")+"'"," && ")]
    [h,if(ModifyFilter != ""): ModifyFilter = " && "+ModifyFilter]
    [h:ModifiablePriorDamage = json.path.put(PriorDamage,"[*][?(@.NoModification==0"+ModifyFilter+")]","CanBeModified",1)]
}]

[h:"<!-- Note: There may be some benefit here to having passive effects simply collect damage modification instances rather than modifying damage as they come up. Then instances can be reordered/sorted and checked again to see if their conditions apply later (eg add damage instance/change damage type first, then other stuff second)"]
[h:"<!-- Note: Min/Max roll and change damage type could be done across all damage instances with one json.path.set (two for crit), if they did not need to update their string. UseMaxRoll requires a loop, so not done. May consider doing this in the future. -->"]
[h:AdjustPriorRollsHow = json.get(tempInstance,"Method")]
[h,switch(AdjustPriorRollsHow),CODE:
    case "MinimumRoll":{
        [h:MinimumRoll = json.get(tempInstance,"Value")]
        [h,foreach(damageInstance,ModifiablePriorDamage),CODE:{
            [h:FlatBonus = json.get(damageInstance,"Bonus")]
            [h:FlatBonusString = json.get(damageInstance,"BonusString")]
            [h:tempDamageArray = json.get(damageInstance,"Array")]
            [h:tempDamageArray = json.path.set(tempDamageArray,"[?(@ < "+MinimumRoll+")]",MinimumRoll)]
            [h:tempCritDamageArray = json.get(damageInstance,"CritArray")]
            [h,if(tempCritDamageArray != ""): tempCritDamageArray = json.path.set(tempCritDamageArray,"[?(@ < "+MinimumRoll+")]",MinimumRoll)]

            [h:tempNewString = json.toList(tempDamageArray," + ")]
            [h,if(tempCritDamageArray!=""):
                NewCritString = tempNewString+json.toList(tempCritDamageArray," + ")+FlatBonusString;
                NewCritString = ""
            ]
            [h:NewString = tempNewString+FlatBonusString]

            [h:NewTotal = math.arraySum(tempDamageArray) + FlatBonus]
            [h:NewCritTotal = NewTotal + math.arraySum(tempCritDamageArray)]

            [h:NewDamageInstance = json.set(damageInstance,
                "Array",tempDamageArray,
                "CritArray",tempCritDamageArray,
                "String",NewString,
                "CritString",NewCritString,
                "Total",NewTotal,
                "CritTotal",NewCritTotal
            )]

            [h,if(json.get(damageInstance,"CanBeModified")): ModifiablePriorDamage = json.set(ModifiablePriorDamage,roll.count,NewDamageInstance)]
        }]
    };
    case "MaximumRoll":{
        [h:MaximumRoll = json.get(tempInstance,"Value")]
        [h,foreach(damageInstance,ModifiablePriorDamage),CODE:{
            [h:FlatBonus = json.get(damageInstance,"Bonus")]
            [h:FlatBonusString = json.get(damageInstance,"BonusString")]
            [h:tempDamageArray = json.get(damageInstance,"Array")]
            [h:tempDamageArray = json.path.set(tempDamageArray,"[?(@ > "+MaximumRoll+")]",MaximumRoll)]
            [h:tempCritDamageArray = json.get(damageInstance,"CritArray")]
            [h,if(tempCritDamageArray != ""): tempCritDamageArray = json.path.set(tempCritDamageArray,"[?(@ > "+MaximumRoll+")]",MaximumRoll)]

            [h:tempNewString = json.toList(tempDamageArray," + ")]
            [h,if(tempCritDamageArray!=""):
                NewCritString = tempNewString+json.toList(tempCritDamageArray," + ")+FlatBonusString;
                NewCritString = ""
            ]
            [h:NewString = tempNewString+FlatBonusString]
            
            [h:NewTotal = math.arraySum(tempDamageArray) + FlatBonus]
            [h:NewCritTotal = NewTotal + math.arraySum(tempCritDamageArray)]

            [h:NewDamageInstance = json.set(damageInstance,
                "Array",tempDamageArray,
                "CritArray",tempCritDamageArray,
                "String",NewString,
                "CritString",NewCritString,
                "Total",NewTotal,
                "CritTotal",NewCritTotal
            )]

            [h,if(json.get(damageInstance,"CanBeModified")): ModifiablePriorDamage = json.set(ModifiablePriorDamage,roll.count,NewDamageInstance)]
        }]
    };
    case "Reroll":{
        [h:"<!-- Reroll options: Method (lowest, highest, choice, all below X, all above X, choose below/above X), Number (All, set number, up to a certain number - requires choice) -->"]
        [h:"<!-- Possibly do 'choice' by making an array with 0/1 for reroll/don't reroll; 0s set by either not eligible or not chosen -->"]
        [h:"<!-- Only need this reroll stuff and adjusting the strings for min/max rolls. Maybe change min/max to json.path. Will likely want to make a table line for rerolls at the very least. -->"]     
    };
    case "ChangeDamageType":{
        [h:ModifiablePriorDamage = json.path.set(ModifiablePriorDamage,"[*]['DamageType']",json.get(tempInstance,"DamageType"))]
    };
    case "UseMaxRoll":{
        [h,foreach(damageInstance,ModifiablePriorDamage),CODE:{
            [h:FlatBonus = json.get(damageInstance,"Bonus")]
            [h:FlatBonusString = json.get(damageInstance,"BonusString")]
            [h:tempNewString = json.toList(json.get(damageInstance,"Dice")," + ")]
            [h,if(json.get(damageInstance,"CritDice")!=""):
                NewCritString = tempNewString+json.toList(json.get(damageInstance,"CritDice")," + ")+FlatBonusString;
                NewCritString = ""
            ]
            [h:NewString = tempNewString+FlatBonusString]

            [h:ModifiablePriorDamage = json.set(ModifiablePriorDamage,roll.count,json.set(damageInstance,
                "Array",json.get(damageInstance,"Dice"),
                "CritArray",json.get(damageInstance,"CritDice"),
                "String",NewString,
                "CritString",NewCritString,
                "Total",json.get(damageInstance,"MaxTotal"),
                "CritTotal",json.get(damageInstance,"CritMaxTotal")
            ))]
        }]
    };
    case "AddDamage":{
        [h:DamageInstanceToAdd = json.get(tempInstance,"DamageInstance")]

        [h:UntypedTest = json.get(DamageInstanceToAdd,"DamageType") == "Untyped"]
        [h,if(UntypedTest),CODE:{
            [h:NewDamageType = json.path.read(ModifiablePriorDamage,"[*][?(@.PrimaryDamageType == 1)]['DamageType']","DEFAULT_PATH_LEAF_TO_NULL")]
            [h,if(json.isEmpty(NewDamageType)): 
                NewDamageType = json.get(json.get(ModifiablePriorDamage,0),"DamageType");
                NewDamageType = json.get(NewDamageType,0)
            ]
            [h:ModifiablePriorDamage = json.append(ModifiablePriorDamage,json.set(DamageInstanceToAdd,"DamageType",NewDamageType))]
        };{
            [h:ModifiablePriorDamage = json.append(ModifiablePriorDamage,DamageInstanceToAdd)]
        }]
    }
]

[h:PriorDamage = json.path.delete(ModifiablePriorDamage,"[*]['CanBeModified']")]

[h:"<!-- Sets PriorDamage so restarting the loop is based on the changes made so far. -->"]