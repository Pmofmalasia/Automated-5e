[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:allFeatures = js.a5e.GatherFeatures(ParentToken,json.set("","ignoreRequirePassive",true))]
[h:featuresWithResource = json.path.read(allFeatures,"\$[*][?(@.MaxResource != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:switchToken(ParentToken)]

[h:"<!-- TODO: MaxResource - Need to remake this whole thing AGAIN -->"]
[h:disAbilityResourceSelection = ""]
[h,foreach(feature,featuresWithResource),CODE:{
	[h:thisFeatureMaxResource = evalMacro(json.get(feature,"MaxResource"))]
	[h,if(json.type(thisFeatureMaxResource) == "OBJECT"),CODE:{
		[h:thisAbilityIdentifier = json.get(feature,"AbilityType")+json.get(feature,"Name")+json.get(feature,"Class")+json.get(feature,"Subclass")]
		[h:thisResourceDisplayNames = json.get(feature,"ResourceDisplayName")]
		[h:thisResourceCurrentAmounts = json.get(feature,"Resource")]
		[h:resourceKeys = json.fields(thisFeatureMaxResource,"json")]

		[h,foreach(resource,resourceKeys): disAbilityResourceSelection = disAbilityResourceSelection + "<tr id='row"+thisAbilityIdentifier+resource+"'><th><label for='"+thisAbilityIdentifier+resource+"'>"+json.get(feature,"DisplayName")+" - "+json.get(thisResourceDisplayNames,resource)+":</label></th><td><input type='number' class='small-number' id='"+thisAbilityIdentifier+resource+"' name='"+thisAbilityIdentifier+resource+"' min=0 max="+json.get(thisFeatureMaxResource,resource)+" value="+json.get(thisResourceCurrentAmounts,resource)+"> / "+json.get(thisFeatureMaxResource,resource)+"</td>"]
	};{
		[h:thisAbilityIdentifier = json.get(feature,"AbilityType")+json.get(feature,"Name")+json.get(feature,"Class")+json.get(feature,"Subclass")]
		[h:thisResourceDisplayName = if(json.get(feature,"ResourceDisplayName") == "",json.get(feature,"DisplayName"),json.get(feature,"ResourceDisplayName"))]
		[h:thisResourceCurrentAmount = json.get(feature,"Resource")]

		[h:disAbilityResourceSelection = disAbilityResourceSelection + "<tr id='row"+thisAbilityIdentifier+"'><th><label for='"+thisAbilityIdentifier+"'>"+thisResourceDisplayName+":</label></th><td><input type='number' class='small-number' id='"+thisAbilityIdentifier+"' name='"+thisAbilityIdentifier+"' min=0 max="+thisFeatureMaxResource+" value="+thisResourceCurrentAmount+"> / "+thisFeatureMaxResource+"</td>"]
	}]
}]

[h:disAbilityResourceSelection = disAbilityResourceSelection + "<tr id='rowSubmit'><th style='text-align:center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'><input type='hidden' name='ParentToken' value='"+ParentToken+"'></tr>"]

[h:html.dialog5("AdjustResources","lib://pm.a5e.core/AdjustResources.html?cachelib=false","value="+base64.encode(disAbilityResourceSelection)+"; width=500; height=285; closebutton=0")]