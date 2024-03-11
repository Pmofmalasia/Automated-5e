[h:abort(input(
	" managementChoice | Add a Library,Remove a Library,Ban a Library,Unban a Library | What would you like to do? | RADIO "
	))]

[h,switch(managementChoice),CODE:
	case 0: {
			[h:abort(input(
				" libDisplayName |  | Input the name of the sourcebook - must be unique "
				))]
			[h:libName = pm.RemoveSpecial(libDisplayName)]
			[h:data.setData("addon:","pm.a5e.core","ms.Sources",json.append(data.getData("addon:","pm.a5e.core","ms.Sources"),json.set("","DisplayName",libDisplayName,"Name",libName,"Library",libName,"Banned",0)))]
			[h:newLibTokenData = json.set("",
				"name","Lib:"+libName,
				"tokenImage",getTokenImage("","Lib:SRD"),
				"x","17",
				"y","7",
				"propertyType","SourcebookData"
			)]
			[h:createToken(newLibTokenData)]
			[h:setSize("Huge","Lib:"+libName)]
			[h:broadcast("Sourcebook "+libDisplayName+" has been added.")]
		};
	case 1: {
			[h:abort(input(
				" libDeleteChoice | "+pm.GetBookInfo("DisplayName")+" | Which library should be deleted? Note: this will not delete the token itself, so you may reverse this by using the 'Add a Library' option. | LIST | VALUE=STRING "
				))]
			[h:abort(input(
				" areYouSure | No,Yes | Are you sure you want to delete "+libDeleteChoice+"? | RADIO "
				))]
			[h,if(areYouSure): data.setData("addon:","pm.a5e.core","ms.Sources",json.path.delete(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[*][?(@.Name == '"+pm.RemoveSpecial(libDeleteChoice)+"')]"))]
			[h:broadcast("Library "+libDeleteChoice+" has been deleted. This has not removed its library token or any of the data contained on it, just in case.")]
		};
	case 2: {
			[h:libsNotBanned = json.toList(json.sort(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[*][?(@.Banned == 0)]['DisplayName']")))]
			[h:abort(input(
				" libBanChoice | "+libsNotBanned+" | Which library should be banned? Note: this will only prevent class features, languages, etc. on the library from appearing in the core library and being chosen. Class features, languages, etc. already chosen will remain. | LIST | VALUE=STRING "
				))]
			[h:data.setData("addon:","pm.a5e.core","ms.Sources",json.path.set(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[*][?(@.Name == '"+pm.RemoveSpecial(libBanChoice)+"')]['Banned']",1))]
			[h:broadcast("Library "+libBanChoice+" has been banned.")]
		};
	case 3: {
			[h:libsBanned = json.toList(json.sort(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[*][?(@.Banned == 1)]['DisplayName']")))]
			[h:libsBanned = if(libsBanned == "","No Libraries Currently Banned",libsBanned)]
			[h:abort(input(
				" libUnbanChoice | "+libsBanned+" | Which library should be unbanned? | LIST | VALUE=STRING "
				))]
			[h:data.setData("addon:","pm.a5e.core","ms.Sources",json.path.set(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[*][?(@.Name == '"+pm.RemoveSpecial(libUnbanChoice)+"')]['Banned']",0))]
			[h:broadcast(if(libUnbanChoice == "No Libraries Currently Banned","No libraries currently banned. No changes made.","Library "+libUnbanChoice+" has been unbanned."))]
		}
	]