[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:ShieldEquipped=json.get(getProperty("a5e.stat.Shield"),0)]
[h:ShieldList="None,"]
[h,count(json.length(a5e.stat.Shield)),code:{
	[if(roll.count>1),code:{
		[ShieldList=ShieldList+json.get(json.get(getProperty("a5e.stat.Shield"),roll.count),"Name")+","]
	};{}]
}]

[h:ArmorEquipped=json.get(getProperty("a5e.stat.Armor"),0)]
[h:ArmorList="None,"]
[h,count(json.length(a5e.stat.Armor)),code:{
	[if(roll.count>1),code:{
		[ArmorList=ArmorList+json.get(json.get(getProperty("a5e.stat.Armor"),roll.count),"Name")+","]
	};{}]
}]

[h:MainHandEquipped=json.get(getProperty("a5e.stat.Weapon"),0)]
[h:OffHandEquipped=json.get(getProperty("a5e.stat.Weapon"),1)]
[h:WeaponList="None,"]
[h,count(json.length(a5e.stat.Weapon)),code:{
	[if(roll.count>2),code:{
		[WeaponList=WeaponList+json.get(json.get(getProperty("a5e.stat.Weapon"),roll.count),"Name")+","]
	};{}]
}]

[h:DeleteSelect=input(
	"ShieldSelection|"+ShieldList+"|Delete Shield|LIST",
	"ArmorSelection|"+ArmorList+"|Delete Armor|LIST",
	"WeaponSelection|"+WeaponList+"|Delete Weapon|LIST"
)]
[h:abort(DeleteSelect)]

[h,if(ShieldSelection==0),code:{};{
	[setProperty("a5e.stat.Shield",if(ShieldSelection<ShieldEquipped,json.set(getProperty("a5e.stat.Shield"),0,json.get(getProperty("a5e.stat.Shield"),0)-1),getProperty("a5e.stat.Shield")))]
	[setProperty("a5e.stat.Shield",json.remove(getProperty("a5e.stat.Shield"),ShieldSelection+1))]
}]

[h,if(ArmorSelection==0),code:{};{
	[setProperty("a5e.stat.Armor",if(ArmorSelection<ArmorEquipped,json.set(getProperty("a5e.stat.Armor"),0,json.get(getProperty("a5e.stat.Armor"),0)-1),getProperty("a5e.stat.Armor")))]
	[setProperty("a5e.stat.Armor",json.remove(getProperty("a5e.stat.Armor"),ArmorSelection+1))]
}]

[h,if(WeaponSelection==0),code:{};{
	[setProperty("a5e.stat.Weapon",if(WeaponSelection+1<MainHandEquipped,json.set(getProperty("a5e.stat.Weapon"),0,json.get(getProperty("a5e.stat.Weapon"),0)-1),getProperty("a5e.stat.Weapon")))]
	[setProperty("a5e.stat.Weapon",if(WeaponSelection+1<OffHandEquipped,json.set(getProperty("a5e.stat.Weapon"),1,json.get(getProperty("a5e.stat.Weapon"),1)-1),getProperty("a5e.stat.Weapon")))]
	[setProperty("a5e.stat.Weapon",json.remove(getProperty("a5e.stat.Weapon"),WeaponSelection+2))]
}]

[h:DeleteConfirmation=input(
	"DeleteConfirm|No,Yes|Are you sure you want to delete "+listGet(ShieldList,ShieldSelection)+", "+listGet(ArmorList,ArmorSelection)+", and "+listGet(WeaponList,WeaponSelection)+"?|LIST"
)]
[h:abort(DeleteConfirmation)]
[h:abort(DeleteConfirm)]

<div style="background-color: #f7ae27; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Delete Equipment</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>{Flavor}</i>
		</div>
		{token.name} has deleted <b>{listGet(ShieldList,ShieldSelection)}</b>, <b>{listGet(ArmorList,ArmorSelection)}</b>, and <b>{listGet(WeaponList,WeaponSelection)}</b>!
	</div>
</div>