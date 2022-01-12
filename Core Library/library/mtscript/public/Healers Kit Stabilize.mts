[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:assert(if(HealersKit>0,1,0),"You have no uses of Healer's Kit remaining!",0)]

<div style="background-color: #22AA22; color: #FFFFFF; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Healer's Kit</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>[r:Flavor]</i>
		</div>
		<b>Action:</b> [r:token.name] tends to the wounds of a dying ally. That ally becomes stable.<br>
		[r:if(json.get(Feats,"Healer")==1,"That ally also regains 1 hit point.<br>","")]
		[r:token.name] has [r:HealersKit=HealersKit-1] Healer's Kit uses remaining.
	</div>
</div>