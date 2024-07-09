[h:DamageModFeature = arg(0)]
[h:DamageModData = json.get(DamageModFeature,"CallDamageMod")]

[h:VulnerabilityInstances = json.get(DamageModData,"Vulnerability")]
[h:ResistanceInstances = json.get(DamageModData,"Resistance")]
[h:ImmunityInstances = json.get(DamageModData,"Immunity")]
[h:AbsorbInstances = json.get(DamageModData,"Absorb")]
[h:DRInstances = json.get(DamageModData,"DR")]

[h,if(VulnerabilityInstances != ""): mod.Vuln = json.merge(mod.Vuln,VulnerabilityInstances)]
[h,if(ResistanceInstances != ""): mod.Res = json.merge(mod.Res,ResistanceInstances)]
[h,if(ImmunityInstances != ""): mod.Immun = json.merge(mod.Immun,ImmunityInstances)]
[h,if(AbsorbInstances != ""): mod.Absorb = json.merge(mod.Absorb,AbsorbInstances)]
[h,if(DRInstances != ""): mod.DR = json.merge(mod.DR,DRInstances)]