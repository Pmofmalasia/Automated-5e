[h:EffectToModify = arg(0)]
[h:ModifyHowData = arg(1)]

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
    [h:pm.a5e.ModifyDamageRollLoop()]
}]

[{"Array":[4,8,2,7],"Total":21,"String":"4 + 8 + 2 + 7","MaxTotal":32,"Dice":[8,8,8,8],"Bonus":0,"Formula":"4d8","DamageType":"Cold","NoModification":0,"IsWeapon":0,"IsSpell":0,"Modifier":1}]

[{"IsSpell":0,"IsWeapon":1,"IsAttack":1,"Modifier":1,"ScalingBase":0,"Array":[5,2],"Total":10,"String":"5 + 2 + 3","MaxTotal":15,"Dice":[6,6],"Bonus":3,"Formula":"2d6 + Str","CritFormula":"2d6 + 2d6 + Str","CritDice":[6,6],"CritArray":[5,2,2,5],"CritString":"5 + 2 + 2 + 5 + 3","CritTotal":17,"CritMaxTotal":15,"DamageType":"Slashing","NoModification":0,"UseCrit":0}]