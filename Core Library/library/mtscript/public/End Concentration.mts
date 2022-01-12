[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:assert(if(Concentration=="",0,1),"You are not concentrating on anything!",0)]

<div style="background-color: #02F5F5; color: #000000; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px;">
	<b>End Concentration</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px; width:400px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>{Flavor}</i>
		</div>
		{token.name} has stopped concentrating on {Concentration}.
	</div>
</div>

[h:setState("Concentrating",0)]
[h:Concentration=""]
[h:UnbreakableConcentration=0]