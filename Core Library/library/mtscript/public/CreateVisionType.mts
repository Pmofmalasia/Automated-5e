[h:CreateVisionTypeHTML = "<tr id='rowHeader'><th text-align='center' colspan='2'>Create Vision Type</th></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowDisplayName'><th><label for='DisplayName'>Vision Type Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:ObscuredOptions = "<option value=2>Not Obscured</option><option value=1>Lightly Obscured</option><option value=0 selected>Heavily Obscured</option>"]
[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowBrightLightSight'><th><label for='BrightLightSight'>Sight in Bright Light:</label></th><td><select id='BrightLightSight' name='BrightLightSight'><option value=2>Not Obscured</option><option value=1>Lightly Obscured</option><option value=0>Heavily Obscured</option></select></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowDimLightSight'><th><label for='DimLightSight'>Sight in Dim Light:</label></th><td><select id='DimLightSight' name='DimLightSight'><option value=2>Not Obscured</option><option value=1 selected>Lightly Obscured</option><option value=0>Heavily Obscured</option></select></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowDarknessSight'><th><label for='DarknessSight'>Sight in Darkness:</label></th><td><select id='DarknessSight' name='DarknessSight'>"+ObscuredOptions+"</select></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowDarknessSight'><th><label for='MagicalDarknessSight'>Sight in Magical Darkness:</label></th><td><select id='MagicalDarknessSight' name='MagicalDarknessSight'>"+ObscuredOptions+"</select></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowInvisibleSight'><th><label for='InvisibleSight'>Sight vs. Invisibility:</label></th><td><select id='InvisibleSight' name='InvisibleSight'>"+ObscuredOptions+"</select></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowEtherealSight'><th><label for='EtherealSight'>Sight into Ethereal Plane:</label></th><td><select id='EtherealSight' name='EtherealSight'>"+ObscuredOptions+"</select></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowIsBlindSight'><th><label for='isBlindSight'>Ignores Blinded Condition:</label></th><td><input type='checkbox' id='isBlindSight' name='isBlindSight'></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowIsColorSight'><th><label for='isColorSight'>Can See Color:</label></th><td><input type='checkbox' id='isColorSight' name='isColorSight' checked></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowIsIllusionSight'><th><label for='isIllusionSight'>See Through Illusions:</label></th><td><input type='checkbox' id='isIllusionSight' name='isIllusionSight'></td></tr>"]

[h:allSourcebooks = pm.GetBookInfo()]
[h:sourcebookOptions = ""]
[h,foreach(tempBook,allSourcebooks),CODE:{
	[h:tempBookDisplayName = json.get(tempBook,"DisplayName")]
	[h,if(length(tempBookDisplayName) > 22): tempBookDisplayName = substring(tempBookDisplayName,0,20)+"..."]
	[h:sourcebookOptions = sourcebookOptions + "<option value='"+json.get(tempBook,"Library")+"'>"+tempBookDisplayName+"</option>"]
}]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowLibrary'><th><label for='Library'>Vision Type Sourcebook:</label></th><td><select id='Library' name='Library'>"+sourcebookOptions+"</select></td></tr>"]

[h:CreateVisionTypeHTML = CreateVisionTypeHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Vision Type Creation","lib://pm.a5e.core/CreateVisionType.html?cachelib=false","value="+base64.encode(CreateVisionTypeHTML)+"; closebutton=0; width=400; height=500")]