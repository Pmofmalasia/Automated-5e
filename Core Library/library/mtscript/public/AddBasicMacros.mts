[h:BaseProps = json.set("",
	"autoExecute",1,
	"minWidth",89,
	"playerEditable",0
)]

[h:AttackButtonProps = json.set(BaseProps,
	"color","black",
	"fontColor","white",
	"sortBy",0,
	"group","01. Combat"
)]

[h:createMacro(json.set(AttackButtonProps,
	"label","Main Hand Attack",
	"command",'[h,macro("SingleAttack@Lib:pm.a5e.Core") : json.set("","Hand",0,"ParentToken",currentToken(),"IsTooltip",0)]',
	"tooltip",'[macro("SingleAttack@Lib:pm.a5e.Core") : json.set("","Hand",0,"ParentToken",currentToken(),"IsTooltip",1)]'
))]

[h:createMacro(json.set(AttackButtonProps,
	"label","Off Hand Attack",
	"command",'[h,macro("SingleAttack@Lib:pm.a5e.Core") : json.set("","Hand",1,"ParentToken",currentToken(),"IsTooltip",0)]',
	"tooltip",'[macro("SingleAttack@Lib:pm.a5e.Core") : json.set("","Hand",1,"ParentToken",currentToken(),"IsTooltip",1)]'
))]

[h:createMacro(json.set(AttackButtonProps,
	"label","Unarmed Strike",
	"command",'[h,macro("SingleAttack@Lib:pm.a5e.Core") : json.set("","Hand",-1,"ParentToken",currentToken(),"IsTooltip",0)]',
	"tooltip",'[macro("SingleAttack@Lib:pm.a5e.Core") : json.set("","Hand",-1,"ParentToken",currentToken(),"IsTooltip",1)]'
))]

[h:createMacro(json.set(AttackButtonProps,
	"label","Initiative",
	"color","#C67F43",
	"fontColor","black",
	"command",'[h,macro("Initiative Border@Lib:pm.a5e.Core") : json.set("","ParentToken",currentToken())]',
	"sortBy",3
))]

[h:createMacro(json.set(AttackButtonProps,
	"label","Other Combat Actions",
	"command",'[h,macro("OtherCombatActions@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]',
	"sortBy",4
))]

[h:SpellButtonProps = json.set(BaseProps,
	"color","aqua",
	"fontColor","black",
	"sortBy","z",
	"group","02. Spells"
)]

[h:createMacro(json.set(SpellButtonProps,
	"label","Active Effects",
	"command",'[h,macro("ActiveEffects@Lib:pm.a5e.Core"): ""]',
	"tooltip",'Macro that controls any active effects, like damage over time.'
))]

[h:createMacro(json.set(SpellButtonProps,
	"label","End Concentration",
	"command",'[macro("EndConcentrationBorder@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:createMacro(json.set(SpellButtonProps,
	"label","Spell Preparation",
	"command",'[h,macro("SpellPreparation@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]',
	"minWidth",191
))]

[h:GeneralButtonProps = json.set(BaseProps,
	"color","blue",
	"fontColor","white",
	"fontSize","1.10em",
	"group","03. General"
)]

[h:createMacro(json.set(GeneralButtonProps,
	"label","Check",
	"command",'[h,macro("CheckInput@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]',
	"tooltip",'[r,MACRO("Check Tooltip@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:createMacro(json.set(GeneralButtonProps,
	"label","Save",
	"command",'[h,macro("SaveInput@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]',
	"tooltip",'[r,MACRO("Save Tooltip@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:DiceButtonProps = json.set(GeneralButtonProps,
	"color","white",
	"fontColor","black",
	"sortBy","z",
	"minWidth",38
)]

[h:createMacro(json.set(DiceButtonProps,
	"label","d4",
	"command",'/tbl D4'
))]

[h:createMacro(json.set(DiceButtonProps,
	"label","d6",
	"command",'/tbl D6'
))]

[h:createMacro(json.set(DiceButtonProps,
	"label","d8",
	"command",'/tbl D8'
))]

[h:createMacro(json.set(DiceButtonProps,
	"label","d10",
	"command",'/tbl D10'
))]

[h:createMacro(json.set(DiceButtonProps,
	"label","d12",
	"command",'/tbl D12'
))]

[h:createMacro(json.set(DiceButtonProps,
	"label","d20",
	"command",'/tbl D20'
))]

[h:createMacro(json.set(DiceButtonProps,
	"label","2d20",
	"sortBy","zz",
	"command",'[h:roll1 = tableImage("D20")]
	[h:roll2 = tableImage("D20")]
	<image src="[r: roll1]"></image> <image src="[r: roll2]"></image>'
))]

[h:createMacro(json.set(DiceButtonProps,
	"label","d100",
	"sortBy","zzz",
	"command",'[h:roll1 = tableImage("D10")]
	[h:roll2 = tableImage("D10")]
	<image src="[r: roll1]"></image> <image src="[r: roll2]"></image>'
))]

[h:EquipmentButtonProps = json.set(BaseProps,
	"color","orange",
	"fontColor","black",
	"group","04. Equipment"
)]

[h:createMacro(json.set(EquipmentButtonProps,
	"label","Equip Items",
	"command",'[h,macro("EquipItem@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:createMacro(json.set(EquipmentButtonProps,
	"label","Show Inventory",
	"command",'[h,macro("ShowInventory@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:createMacro(json.set(EquipmentButtonProps,
	"label","Drop Items",
	"sortBy","4",
	"command",'[h,macro("DropItemInput@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:createMacro(json.set(EquipmentButtonProps,
	"label","Give Items",
	"sortBy","4",
	"command",'[h,macro("GiveItemInput@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:createMacro(json.set(EquipmentButtonProps,
	"label","Pick Up Items",
	"sortBy","4",
	"command",'[h,macro("PickUpItem@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:VisionButtonProps = json.set(BaseProps,
	"color","lime",
	"fontColor","black",
	"group","05. Vision/Light"
)]

[h:createMacro(json.set(VisionButtonProps,
	"label","Active Lights",
	"sortBy","4",
	"command",'[h,macro("ActiveLightsInput@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:createMacro(json.set(VisionButtonProps,
	"label","Active Vision",
	"sortBy","4",
	"command",'[h,macro("ActiveVision@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]

[h:SettingsButtonProps = json.set(BaseProps,
	"color","white",
	"fontColor","black",
	"group","06. Token Settings"
)]

[h:createMacro(json.set(SettingsButtonProps,
	"label","Ability Display Settings",
	"sortBy","4",
	"command",'[h,macro("AbilityDisplaySettings@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]'
))]