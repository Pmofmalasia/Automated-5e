[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:ArmorEquipped=json.get(getProperty("a5e.stat.Armor"),0)]
[h:OldArmorMagic=json.get(json.get(getProperty("a5e.stat.Armor"),json.get(getProperty("a5e.stat.Armor"),0)),"MagicItem")]
[h:OldArmorName=json.get(json.get(getProperty("a5e.stat.Armor"),json.get(getProperty("a5e.stat.Armor"),0)),"Name")]
[h:ArmorList=""]
[h,count(json.length(a5e.stat.Armor)),code:{
	[if(roll.count>0),code:{
		[ArmorList=ArmorList+json.get(json.get(getProperty("a5e.stat.Armor"),roll.count),"Name")+","]
	};{}]
}]

[h:ShieldEquipped=json.get(getProperty("a5e.stat.Shield"),0)]
[h:ShieldList=""]
[h,count(json.length(a5e.stat.Shield)),code:{
	[if(roll.count>1),code:{
		[ShieldList=ShieldList+json.get(json.get(getProperty("a5e.stat.Shield"),roll.count),"Name")+","]
	};{}]
}]

[h:MainHandEquipped=json.get(getProperty("a5e.stat.Weapon"),0)]
[h:WeaponList=""]
[h:OldMHMagic=json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),0)),"MagicItem")]
[h:OldMHName=json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),0)),"Name")]
[h,count(json.length(a5e.stat.Weapon)),code:{
	[if(roll.count>1),code:{
		[WeaponList=WeaponList+json.get(json.get(getProperty("a5e.stat.Weapon"),roll.count),"Name")+","]
	};{}]
}]

[h:defaultVars="{}"]
[h:AttunementList="None"]
[h:ItemCount=0]
[h:AttuneCount=0]
[h:AttuneItemPositions=json.append("",0)]
[h:AttuneSlot1=0]
[h:AttuneSlot2=0]
[h:AttuneSlot3=0]
[h:AttuneSlot4=0]
[h:AttuneSlot5=0]
[h:AttuneSlot6=0]
[h:Attune1=0]
[h:Attune2=0]
[h:Attune3=0]
[h:Attune4=0]
[h:Attune5=0]
[h:Attune6=0]
[h:MiscEquipmentList=""]
[h:NotEquipmentList=""]

[h,foreach(item,MagicItemAttuned),code:{
	[h:AttunementList=if(json.get(item,"reqAttunement")==1,listAppend(AttunementList,json.get(MagicItemNames,roll.count)),AttunementList)]
	[h:AttuneCount=if(json.get(item,"reqAttunement")==1,AttuneCount+1,AttuneCount)]
	[h:AttuneItemPositions=if(json.get(item,"reqAttunement")==1,json.append(AttuneItemPositions,ItemCount),AttuneItemPositions)]
	[h:AttuneSlot1=if(json.get(item,"slotAttunement")==1,AttuneCount,AttuneSlot1)]
	[h:AttuneSlot2=if(json.get(item,"slotAttunement")==2,AttuneCount,AttuneSlot2)]
	[h:AttuneSlot3=if(json.get(item,"slotAttunement")==3,AttuneCount,AttuneSlot3)]
	[h:AttuneSlot4=if(json.get(item,"slotAttunement")==4,AttuneCount,AttuneSlot4)]
	[h:AttuneSlot5=if(json.get(item,"slotAttunement")==5,AttuneCount,AttuneSlot5)]
	[h:AttuneSlot6=if(json.get(item,"slotAttunement")==6,AttuneCount,AttuneSlot6)]
	[h:MiscEquipmentList=if(json.get(json.get(MagicItemEquipment,roll.count),"reqEquip")==4,listAppend(MiscEquipmentList,"placeholderVar | "+json.get(json.get(MagicItemEquipment,roll.count),"isEquipped")+" | "+json.get(MagicItemNames,roll.count)+" | CHECK | ","##"),MiscEquipmentList)]
	[h:NotEquipmentList=if(and(json.get(json.get(MagicItemEquipment,roll.count),"reqEquip")==0,json.get(item,"reqAttunement")==0,json.get(MagicItemNames,roll.count)!="Default"),listAppend(NotEquipmentList,"junkVar | "+json.get(MagicItemNames,roll.count)+" |  | LABEL | SPAN=TRUE","##"),NotEquipmentList)]
	[h:ItemCount=ItemCount+1]
}]

<!-- If I end up adding Arcane Foci, add another layer to the first condition of the shield section denoting that it is not a weapon and not a shield (unarmed as it is now)-->
[h:MainHandList=WeaponList]
[h:OffHandList=WeaponList+ShieldList]
[h:OffHandCurrent=if(json.get(getProperty("a5e.stat.Weapon"),1)==2,if(json.get(getProperty("a5e.stat.Shield"),0)==1,0,listCount(WeaponList)+json.get(getProperty("a5e.stat.Shield"),0)-3),json.get(getProperty("a5e.stat.Weapon"),1)-2)]
[h:OldOHMagic=if(json.get(getProperty("a5e.stat.Weapon"),1)==2,if(json.get(getProperty("a5e.stat.Shield"),0)==1,0,json.get(json.get(getProperty("a5e.stat.Shield"),json.get(getProperty("a5e.stat.Shield"),0)),"MagicItem")),json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),1)),"MagicItem"))]
[h:OldOHName=if(json.get(getProperty("a5e.stat.Weapon"),1)==2,if(json.get(getProperty("a5e.stat.Shield"),0)==1,"Unarmed",json.get(json.get(getProperty("a5e.stat.Shield"),json.get(getProperty("a5e.stat.Shield"),0)),"Name")),json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),1)),"Name"))]
[h:disAttunementGap=if(AttunementList=="None","","junkVar | ------------------------------------------------------ | | LABEL | SPAN=TRUE")]
[h:disAttunement=if(AttunementList=="None","","junkVar | Select Your Attuned Magic Items | | LABEL | SPAN=TRUE")]
[h:disAttunement1=if(AttunementList=="None","","Attune1 | "+AttunementList+" | Attunement Slot 1 | LIST | SELECT="+AttuneSlot1)]
[h:disAttunement2=if(AttunementList=="None","","Attune2 | "+AttunementList+" | Attunement Slot 2 | LIST | SELECT="+AttuneSlot2)]
[h:disAttunement3=if(AttunementList=="None","","Attune3 | "+AttunementList+" | Attunement Slot 3 | LIST | SELECT="+AttuneSlot3)]
[h:disEquipGap=if(MiscEquipmentList=="","","junkVar | ------------------------------------------------------ | | LABEL | SPAN=TRUE")]
[h:disEquip=if(MiscEquipmentList=="","","junkVar | Select Your Equipped Magic Items | | LABEL | SPAN=TRUE")]
[h:disNotEquip=if(NotEquipmentList=="","","junkVar | Other Magic Items Owned |  | LABEL | SPAN=TRUE")]

[h:EquipmentSelect=input(
	"junkVar|Choose Equipment:| |LABEL|SPAN=TRUE",
	"ArmorSelection|"+ArmorList+"|Armor|LIST|SELECT="+(ArmorEquipped-1),
	"MainHandSelection|"+MainHandList+"|Main Hand|LIST|SELECT="+(MainHandEquipped-2),
	"OffHandSelection|"+OffHandList+"|Off Hand|LIST|SELECT="+OffHandCurrent,
	""+disAttunementGap+"",
	""+disAttunement+"",
	""+disAttunement1+"",
	""+disAttunement2+"",
	""+disAttunement3+"",
	""+disEquipGap+"",
	""+disEquip+"",
	""+MiscEquipmentList+"",
	""+disNotEquip+"",
	""+NotEquipmentList+""
)]
[h:abort(EquipmentSelect)]

[h,if(MainHandSelection==0),code:{};{
	[assert(if(OffHandSelection==MainHandSelection,0,1),"You cannot equip the same weapon twice!",0)]
}]

[h:TwoHandedWeaponTest=if(json.get(json.get(json.get(getProperty("a5e.stat.Weapon"),MainHandSelection+2),"Props"),"Two-Handed")==1,1,0)]

[h,if(TwoHandedWeaponTest==1),code:{
	[assert(if(OffHandSelection>0,0,1),"You cannot equip anything in your off hand while wielding a two-handed weapon!",0)]
};{}]

[h:NonLightCount=0]
[h:DualWieldMessage=""]

[h:NonLightCount=if(json.get(json.get(json.get(getProperty("a5e.stat.Weapon"),MainHandSelection+2),"Props"),"Light")==0,NonLightCount+1,NonLightCount)]

[h:ShieldTest=if(OffHandSelection>(listCount(WeaponList)-2),1,0)]

[h,if(ShieldTest==1),code:{
	[setProperty("a5e.stat.Weapon",json.set(getProperty("a5e.stat.Weapon"),1,2))]
	[setProperty("a5e.stat.Shield",json.set(getProperty("a5e.stat.Shield"),0,OffHandSelection-listCount(WeaponList)+3))]
	[NewOHMagic=json.get(json.get(getProperty("a5e.stat.Shield"),json.get(getProperty("a5e.stat.Shield"),0)),"MagicItem")]
};{
	[h:NonLightCount=if(json.get(json.get(json.get(getProperty("a5e.stat.Weapon"),OffHandSelection+2),"Props"),"Light")==0,NonLightCount+1,NonLightCount)]
	[setProperty("a5e.stat.Weapon",json.set(getProperty("a5e.stat.Weapon"),1,OffHandSelection+2))]
	[setProperty("a5e.stat.Shield",json.set(getProperty("a5e.stat.Shield"),0,1))]
	[NewOHMagic=json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),1)),"MagicItem")]
}]

[h:setProperty("a5e.stat.Armor",json.set(getProperty("a5e.stat.Armor"),0,ArmorSelection+1))]
[h:setProperty("a5e.stat.Weapon",json.set(getProperty("a5e.stat.Weapon"),0,MainHandSelection+2))]
[h:NewMHMagic=json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),0)),"MagicItem")]
[h:NewArmorMagic=json.get(json.get(getProperty("a5e.stat.Armor"),json.get(getProperty("a5e.stat.Armor"),0)),"MagicItem")]

[h:MHChangeTest=if(MainHandEquipped==(MainHandSelection+2),0,1)]
[h:ArmorChangeTest=if(ArmorEquipped==(ArmorSelection+1),0,1)]
[h:OHChangeTest=if(MainHandEquipped==(MainHandSelection+2),0,1)]

[h:miStatChangeTest=if(or(and(MHChangeTest==0,ArmorChangeTest==0,OHChangeTest==0),and(NewArmorMagic==0,OldArmorMagic==0,NewMHMagic==0,OldMHMagic==0,NewOHMagic==0,OldOHMagic==0)),0,1)]
[h:miStatChangeArray="[]"]

[h,if(and(MHChangeTest==1,OldMHMagic==1)),CODE:{
	[h,count(json.length(MagicItemNames)),CODE:{
		[h:MagicItemEquipment=if(json.get(MagicItemNames,roll.count)==OldMHName,json.set(MagicItemEquipment,roll.count,json.set("","reqEquip",1,"isEquipped",0,"CastingFocus",json.get(json.get(MagicItemEquipment,roll.count),"CastingFocus"))),MagicItemEquipment)]
		[h:miStatChangeArray=if(json.get(MagicItemNames,roll.count)==OldMHName,json.append(miStatChangeArray,roll.count),miStatChangeArray)]
	}]
};{}]
	
[h,if(and(MHChangeTest==1,NewMHMagic==1)),CODE:{
	[h,count(json.length(MagicItemNames)),CODE:{
		[h:MagicItemEquipment=if(json.get(MagicItemNames,roll.count)==json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),0)),"Name"),json.path.set(MagicItemEquipment,"["+roll.count+"].isEquipped",1),MagicItemEquipment)]
		[h:miStatChangeArray=if(json.get(MagicItemNames,roll.count)==json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),0)),"Name"),json.append(miStatChangeArray,roll.count),miStatChangeArray)]
	}]
};{}]
	
[h,if(and(OHChangeTest==1,OldOHMagic==1)),CODE:{
	[h,count(json.length(MagicItemNames)),CODE:{
		[h:MagicItemEquipment=if(json.get(MagicItemNames,roll.count)==OldOHName,json.path.set(MagicItemEquipment,"["+roll.count+"].isEquipped",1),MagicItemEquipment)]
		[h:miStatChangeArray=if(json.get(MagicItemNames,roll.count)==OldOHName,json.append(miStatChangeArray,roll.count),miStatChangeArray)]
	}]
};{}]
	
[h,if(and(OHChangeTest==1,NewOHMagic==1)),CODE:{
	[h,count(json.length(MagicItemNames)),CODE:{
		[h:MagicItemEquipment=if(json.get(MagicItemNames,roll.count)==json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),1)),"Name"),json.path.set(MagicItemEquipment,"["+roll.count+"].isEquipped",1),MagicItemEquipment)]
		[h:miStatChangeArray=if(json.get(MagicItemNames,roll.count)==json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),1)),"Name"),json.append(miStatChangeArray,roll.count),miStatChangeArray)]
	}]
};{}]
	
[h,if(and(ArmorChangeTest==1,OldArmorMagic==1)),CODE:{
	[h,count(json.length(MagicItemNames)),CODE:{
		[h:MagicItemEquipment=if(json.get(MagicItemNames,roll.count)==OldArmorName,json.path.set(MagicItemEquipment,"["+roll.count+"].isEquipped",1),MagicItemEquipment)]
		[h:miStatChangeArray=if(json.get(MagicItemNames,roll.count)==OldArmorName,json.append(miStatChangeArray,roll.count),miStatChangeArray)]
	}]
};{}]
	
[h,if(and(ArmorChangeTest==1,NewArmorMagic==1)),CODE:{
	[h,count(json.length(MagicItemNames)),CODE:{
		[h:MagicItemEquipment=if(json.get(MagicItemNames,roll.count)==json.get(json.get(getProperty("a5e.stat.Armor"),json.get(getProperty("a5e.stat.Armor"),0)),"Name"),json.path.set(MagicItemEquipment,"["+roll.count+"].isEquipped",1),MagicItemEquipment)]
		[h:miStatChangeArray=if(json.get(MagicItemNames,roll.count)==json.get(json.get(getProperty("a5e.stat.Armor"),json.get(getProperty("a5e.stat.Armor"),0)),"Name"),json.append(miStatChangeArray,roll.count),miStatChangeArray)]
	}]
};{}]

[h:NumberAttuned=if(Attune1==0,0,1)+if(Attune2==0,0,1)+if(Attune3==0,0,1)+if(Attune4==0,0,1)+if(Attune5==0,0,1)+if(Attune6==0,0,1)]

<!-- needs to not override items set previously and not add the same item to the array twice -->

	[h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,AttuneSlot1)+"].slotAttunement",0)]
	[h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,AttuneSlot2)+"].slotAttunement",0)]
	[h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,AttuneSlot3)+"].slotAttunement",0)]
	[h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,AttuneSlot4)+"].slotAttunement",0)]
	[h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,AttuneSlot5)+"].slotAttunement",0)]
	[h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,AttuneSlot6)+"].slotAttunement",0)]
	[h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,Attune1)+"].slotAttunement",1)]
    [h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,Attune2)+"].slotAttunement",2)]
    [h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,Attune3)+"].slotAttunement",3)]
    [h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,Attune4)+"].slotAttunement",4)]
    [h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,Attune5)+"].slotAttunement",5)]
    [h:MagicItemAttuned=json.path.set(MagicItemAttuned,"["+json.get(AttuneItemPositions,Attune6)+"].slotAttunement",6)]

[h,if(AttuneSlot1==Attune1),code:{};{
	[h:miStatChangeTest=miStatChangeTest+1]
	[h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot1)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot1)))]
	[h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,Attune1)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,Attune1)))]
}]

[h,if(AttuneSlot2==Attune2),code:{};{
	[h:miStatChangeTest=miStatChangeTest+1]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot2)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot2)))]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,Attune2)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,Attune2)))]
}]

[h,if(AttuneSlot3==Attune3),code:{};{
	[h:miStatChangeTest=miStatChangeTest+1]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot3)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot3)))]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,Attune3)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,Attune3)))]
}]

[h,if(AttuneSlot4==Attune4),code:{};{
	[h:miStatChangeTest=miStatChangeTest+1]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot4)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot4)))]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,Attune4)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,Attune4)))]
}]

[h,if(AttuneSlot5==Attune5),code:{};{
	[h:miStatChangeTest=miStatChangeTest+1]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot5)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot5)))]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,Attune5)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,Attune5)))]
}]

[h,if(AttuneSlot6==Attune6),code:{};{
	[h:miStatChangeTest=miStatChangeTest+1]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot6)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,AttuneSlot6)))]
    [h:miStatChangeArray=if(json.contains(miStatChangeArray,json.get(AttuneItemPositions,Attune6)),miStatChangeArray,json.append(miStatChangeArray,json.get(AttuneItemPositions,Attune6)))]
}]

[h:miStatChangeArray=if(json.equals(miStatChangeArray,"[]"),"[0]",miStatChangeArray)]

[h,if(miStatChangeTest==0),CODE:{};{
	[MACRO("Magic Item Stats@Lib:pm.a5e.Core"):miStatChangeArray]
}]

<div style="background-color: #f7ae27; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;width:400px">
	<b>Equipment Selection</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>[r:Flavor]</i>
		</div>
		<table>
			<tr><td>[r:token.name] has equipped: </td><td>[r:listGet(ArmorList,ArmorSelection)]</td></tr>
			<tr><td></td><td>[r:listGet(MainHandList,MainHandSelection)]</td></tr>
			<tr><td></td><td>[r:listGet(OffHandList,OffHandSelection)]</td></tr>
		</table>
	</div>
</div>