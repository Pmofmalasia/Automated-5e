[h:oldEffect = arg(0)]
[h:newDamage = arg(1)]
[h:damageTypesToAdd = json.fields(newDamage)]

[h,foreach(damageType,damageTypesToAdd),CODE:{
    [h:newDamageAmount = json.get(newDamage,damageType)]
    [h:noDamageTest = json.get(oldEffect,"Damage")==""]
    [h,if(noDamageTest),CODE:{
        [h:oldEffect = json.set(oldEffect,"Damage",json.set("",damageType,json.append("",newDamageAmount)))]
    };{
        [h:noThisTypeTest = (json.get(json.get(oldEffect,"Damage"),damageType) == "")]
        [h,if(noThisTypeTest):
            oldEffect = json.path.put(oldEffect,"['Damage']",damageType,json.append("",newDamageAmount));
            oldEffect = json.path.set(oldEffect,"['Damage']['"+damageType+"']",json.append(json.get(json.get(oldEffect,"Damage"),damageType)),newDamageAmount)
        ]
    }]
}]

[h:macro.return = oldEffect]