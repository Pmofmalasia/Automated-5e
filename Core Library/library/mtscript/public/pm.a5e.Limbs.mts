[h:ParentToken = arg(0)]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Attack"]

[h:StandardLimb = json.set("","Length",5,"Limits","{}")]
[h:UsableLimbs = json.append("",
	json.set(StandardLimb,
		"Name","MainHand",
		"DisplayName","Main Hand"),
	json.set(StandardLimb,
		"Name","OffHand",
		"DisplayName","Off Hand")
)]
[h:pm.PassiveFunction("Limbs")]

[h:macro.return = UsableLimbs]