[h:RevertTransformationData = macro.args]
[h:ParentToken = json.get(RevertTransformationData,"ParentToken")]
[h:EndingFormID = json.get(RevertTransformationData,"FormID")]
[h:switchToken(ParentToken)]

[h:OldFormData = getProperty("a5e.stat.PreviousForms")]
[h:thisFormIndex = -1]
[h,foreach(form,OldFormData),CODE:{
	[h,if(json.get(form,"AssociatedCondition") == EndingFormID),CODE:{
		[h:OldForm = form]
		[h:thisFormIndex = roll.count]
	};{}]
}]
[h,if(thisFormIndex == -1): return(0,"{}")]

[h:transformNowTest = thisFormIndex == 0]

[h,if(transformNowTest),CODE:{
	[h:NewInventory = json.path.delete(getProperty("a5e.stat.Inventory"),"\$[*][?(@.AssociatedCondition == '"+EndingFormID+"')]")]
	[h:NewInventory = json.merge(NewInventory,json.get(json.get(OldForm,"Properties"),"a5e.stat.Inventory"))]

	[h:OldFormProperties = json.get(OldForm,"Properties")]
	[h:OldFormPropertyNames = json.get(OldForm,"RawPropertyNames")]
	[h:OldFormMacros = json.get(OldForm,"Macros")]
	[h:OldFormMTProperties = json.get(OldForm,"MTProperties")]

	[h:thisFormMacros = getMacros("json",ParentToken)]
	[h,foreach(macroName,thisFormMacros),CODE:{
		[h:thisMacroIndex = getMacroIndexes(macroName,"json",ParentToken)]
		[h,foreach(index,thisMacroIndex): removeMacro(index)]
	}]
	[h,foreach(macro,OldFormMacros): createMacro(macro)]

	[h,foreach(prop,OldFormPropertyNames),CODE:{
		[h,if(json.contains(OldFormProperties,prop)):
			setProperty(prop,json.get(OldFormProperties,prop));
			setProperty(prop,getPropertyDefault(prop))
		]
	}]
	[h:setProperty("a5e.stat.Inventory",NewInventory)]

	[h:setTokenImage(json.get(OldFormMTProperties,"tokenImage"))]
	[h:setTokenPortrait(json.get(OldFormMTProperties,"tokenPortrait"))]
	[h:setTokenHandout(json.get(OldFormMTProperties,"tokenHandout"))]
	[h:setSightType(json.get(OldFormMTProperties,"Sight"))]
	[h:setSize(json.get(OldFormMTProperties,"size"))]
};{
	[h:OldFormData = json.path.delete(OldFormData,"\$[*]['Properties']['a5e.stat.Inventory'][*][?(@.AssociatedCondition == '"+EndingFormID+"')]")]

	[h:"<!-- Anything that isn't merged should replace the index before it - the data in the index before is the one that is actually ending, OldFormData needs to be kept -->"]
}]

[h:OldFormData = json.remove(OldFormData,thisFormIndex)]
[h:setProperty("a5e.stat.PreviousForms",OldFormData)]

[h:return(0,json.set("","Table","[]","RevertedForms",""))]