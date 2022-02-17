[h:AttackData = macro.args]
[h:ParentToken = json.get(AttackData,"ParentToken")]

[h:FlavorData = json.set("",
	"Throw Weapon",0,
	"Hand",0,
	"AttackNum",1,
	"DMOnly",0,
	"ParentToken",ParentToken
)]

[macro("Attack@Lib:pm.a5e.Core") : FlavorData]