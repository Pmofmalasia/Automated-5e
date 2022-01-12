[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:assert(if(getState("ReactionUsed")==1,0,1),"You have already used your reaction!",0)]

[h:setState("ReactionUsed",1)]

<div style="background-color: #fcf734; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Opportunity Attack (Reaction)</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		[macro("Attack@Lib:Melek"):macro.args]
		<table>
			[r:if(and(json.get(LClass,"LPdn")>=7,json.get(PdnOath,"Vgnc")==1),"<tr><td> <b>Relentless Avenger</b></td><td> When you hit a creature with an opportunity attack, you can move up to half your speed immediately after the attack and as part of the same reaction. This movement doesn't provoke opportunity attacks.</td></tr>","")]
			[r:if(json.get(Feats,"PolearmMaster")==1,"<tr><td> <b>Punishing Reach</b></td><td>&#8226; &nbsp; </td><td> While you are wielding a glaive, halberd, pike, or quarterstaff, other creatures provoke an opportunity attack from you when they enter your reach.</td></tr>","")]
			[r:if(json.get(Feats,"Sentinel")==1,"
				<tr><td> <b>Sentinel</b></td><td>&#8226; &nbsp; </td><td> When you hit an enemy with an opportunity attack, the creature's speed becomes 0 for the rest of the turn.</td></tr>
				<tr><td></td><td>&#8226; &nbsp; </td><td> Creatures within 5 feet of you provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.</td></tr>
				<tr><td></td><td>&#8226; &nbsp; </td><td> When a creature within 5 feet of you makes an attack against a target other than you (and the target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.</td></tr>
			","")]
			[r:if(json.get(Feats,"MageSlayer")==1,"<tr><td><b>Mage Slayer</b> </td><td>When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature.</td></tr> ","")]
		</table>
	</div>
</div>