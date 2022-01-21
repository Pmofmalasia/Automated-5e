[h:sv.Data = macro.args]
[h:a5e.GatherAbilities()]
[h:roll1=1d20]
[h:roll2=1d20]

[h:FormattingData = json.get(sv.Data,"Formatting")]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:output.PC = json.get(json.get(sv.Data,"Output"),"Player")]
[h:output.GM = json.get(json.get(sv.Data,"Output"),"GM")]

[h:baseBonus = json.get(AtrMods,pm.RemoveSpecial(json.get(sv.Data,"Name")))]
[h:profBonus = Proficiency * json.get(Saves,pm.RemoveSpecial(json.get(sv.Data,"Name")))]
[h:sv.TotalBonus = baseBonus + profBonus]

[h:sv.Adv = 0]
[h:sv.Dis = 0]
[h:pm.PassiveFunction("SaveAdv")]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header",json.get(sv.Data,"Name")+" Save",
	"FalseHeader","",
	"FullContents","<span style='"+if(roll1==20,"font-size:2em; color:"+CritColor,if(roll1==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(roll1+sv.TotalBonus)+"</span>",
	"RulesContents","1d20 + "+substring(json.get(sv.Data,"Name"),0,3)+pm.PlusMinus(profBonus,0)+" = ",
	"RollContents",roll1+pm.PlusMinus(baseBonus,1)+pm.PlusMinus(profBonus,0)+" = ",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","Reroll",
	"Link",macroLinkText("Save Reroll@Lib:pm.a5e.Core","self-gm",sv.Data,json.get(sv.Data,"ParentToken")),
	"Value",(roll1+json.get(sv.Data,"Bonus"))
	))]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:macro.return = json.set("","Player",(output.PC+json.get(output.Temp,"Player")),"GM",(output.GM+json.get(output.Temp,"GM")),"Result",(roll1+json.get(sv.Data,"Bonus")))]