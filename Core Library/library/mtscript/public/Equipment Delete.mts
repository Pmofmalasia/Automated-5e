[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:ShieldEquipped=json.get(Shield,0)]
[h:ShieldList="None,"]
[h,count(json.length(Shield)),code:{
	[if(roll.count>1),code:{
		[ShieldList=ShieldList+json.get(json.get(Shield,roll.count),"Name")+","]
	};{}]
}]

[h:ArmorEquipped=json.get(Armor,0)]
[h:ArmorList="None,"]
[h,count(json.length(Armor)),code:{
	[if(roll.count>1),code:{
		[ArmorList=ArmorList+json.get(json.get(Armor,roll.count),"Name")+","]
	};{}]
}]

[h:MainHandEquipped=json.get(Weapon,0)]
[h:OffHandEquipped=json.get(Weapon,1)]
[h:WeaponList="None,"]
[h,count(json.length(Weapon)),code:{
	[if(roll.count>2),code:{
		[WeaponList=WeaponList+json.get(json.get(Weapon,roll.count),"Name")+","]
	};{}]
}]

[h:DeleteSelect=input(
	"ShieldSelection|"+ShieldList+"|Delete Shield|LIST",
	"ArmorSelection|"+ArmorList+"|Delete Armor|LIST",
	"WeaponSelection|"+WeaponList+"|Delete Weapon|LIST"
)]
[h:abort(DeleteSelect)]

[h,if(ShieldSelection==0),code:{};{
	[Shield=if(ShieldSelection<ShieldEquipped,json.set(Shield,0,json.get(Shield,0)-1),Shield)]
	[Shield=json.remove(Shield,ShieldSelection+1)]
}]

[h,if(ArmorSelection==0),code:{};{
	[Armor=if(ArmorSelection<ArmorEquipped,json.set(Armor,0,json.get(Armor,0)-1),Armor)]
	[Armor=json.remove(Armor,ArmorSelection+1)]
}]

[h,if(WeaponSelection==0),code:{};{
	[Weapon=if(WeaponSelection+1<MainHandEquipped,json.set(Weapon,0,json.get(Weapon,0)-1),Weapon)]
	[Weapon=if(WeaponSelection+1<OffHandEquipped,json.set(Weapon,1,json.get(Weapon,1)-1),Weapon)]
	[Weapon=json.remove(Weapon,WeaponSelection+2)]
}]

[h:DeleteConfirmation=input(
	"DeleteConfirm|No,Yes|Are you sure you want to delete "+listGet(ShieldList,ShieldSelection)+", "+listGet(ArmorList,ArmorSelection)+", and "+listGet(WeaponList,WeaponSelection)+"?|LIST"
)]
[h:abort(DeleteConfirmation)]
[h:Abort(DeleteConfirm)]

<div style="background-color: #f7ae27; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Delete Equipment</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>{Flavor}</i>
		</div>
		{token.name} has deleted <b>{listGet(ShieldList,ShieldSelection)}</b>, <b>{listGet(ArmorList,ArmorSelection)}</b>, and <b>{listGet(WeaponList,WeaponSelection)}</b>!
	</div>
</div>