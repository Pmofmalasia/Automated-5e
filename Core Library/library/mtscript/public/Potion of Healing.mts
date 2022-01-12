[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

<div style="background-color: #22AA22; color: #FFFFFF; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Potion of Healing</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>[r:Flavor]</i>
		</div>
		<b>Action:</b> [r:token.name] quaffs a[r:if(HealingPotion>0,"","n empty")] Potion of Healing and regains [r:healing=if(HealingPotion>0,Min(2d4+2,MaxHP-HP),0)] HP for a total of [h: HP=if(HP<0,if(healing>0,0,HP),HP)][r:HP=Min(HP+healing,MaxHP)].<br>
		[r:token.name] has [r:HealingPotion=Max(HealingPotion-1,0)] Potions of Healing left.
	</div>
</div>
[h:state.Dying=if(HP <= 0, 1, 0)]
[h:state.Unconscious=if(HP > 0, 0, state.Unconscious)]
[h:bar.Health = HP / MaxHP]