[h:targetSpecificEffects = json.get(macro.args,"Specific")]
[h:generalEffects = json.get(macro.args,"General")]

[h,if(json.contains(targetSpecificEffects,"ModifyDamage")),CODE:{
	
};{}]