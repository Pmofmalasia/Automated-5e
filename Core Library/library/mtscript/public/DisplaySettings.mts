[h:SettingsData = macro.args]
[h:SettingsDestination = json.get(SettingsData,"SettingsDestination")]
[h,switch(SettingsDestination),CODE:
	case "Chat":{
		[h:activeChatSettings = data.getData("addon:","pm.a5e.core","ChatSettings")]
		[h:isTooltip = 0]
		[h:Title = "Chat Display Settings"]
	};
	case "PersonalChat":{
		[h:allPlayerChatSettings = data.getData("addon:","pm.a5e.core","PlayerChatSettings")]
		[h:PlayerDisplayName = getPlayerName()]
		[h:PlayerName = pm.RemoveSpecial(PlayerDisplayName)]
		[h:thisPlayerChatSettings = json.get(allPlayerChatSettings,PlayerName)]
		[h,if(thisPlayerChatSettings == ""):
			activeChatSettings = data.getData("addon:","pm.a5e.core","ChatSettings");
			activeChatSettings = thisPlayerChatSettings
		]
		[h:isTooltip = 0]
		[h:Title = "Personal Chat Display Settings"]
	};
	case "Tooltip":{
		[h:activeChatSettings = data.getData("addon:","pm.a5e.core","TooltipSettings")]
		[h:isTooltip = 1]
		[h:Title = "Tooltip Settings"]
	};
	case "PersonalTooltip":{
		[h:allPlayerChatSettings = data.getData("addon:","pm.a5e.core","PlayerTooltipSettings")]
		[h:PlayerDisplayName = getPlayerName()]
		[h:PlayerName = pm.RemoveSpecial(PlayerDisplayName)]
		[h:thisPlayerChatSettings = json.get(allPlayerChatSettings,PlayerName)]
		[h,if(thisPlayerChatSettings == ""):
			activeChatSettings = data.getData("addon:","pm.a5e.core","TooltipSettings");
			activeChatSettings = thisPlayerChatSettings
		]
		[h:isTooltip = 1]
		[h:Title = "Personal Tooltip Settings"]
	}
]

[h:currentChatColors = json.get(activeChatSettings,"ChatColors")]
[h:FontOptions = data.getData("addon:","pm.a5e.core","FontOptions")]
[h:FontOptionsHTML = ""]
[h,foreach(font,FontOptions): FontOptionsHTML = FontOptionsHTML + "<option value'"+font+"'>"+font+"</option>"]

[h:DisplaySettingsHTML = "<tr id='rowHeader'><th text-align='center' colspan='2'>"+Title+"</th><input type='hidden' id='SettingsDestination' name='SettingsDestination' value='"+SettingsDestination+"'></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowResetToDefault'><th><label for='isResetToDefault'>Reset to Defaults:</label></th><td><input type='checkbox' id='isResetToDefault' name='isResetToDefault'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowVertical'><th><label for='isVertical'>Vertical Chat Orientation:</label></th><td><input type='checkbox' id='isVertical' name='isVertical' "+if(json.get(activeChatSettings,"VerticalDisplay")==1,"checked","")+"></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkMode'><th><label for='isDarkMode'>Use Dark Mode:</label></th><td><input type='checkbox' id='isDarkMode' name='isDarkMode' "+if(json.get(activeChatSettings,"DarkMode")==1,"checked","")+"></td></tr>"]

[h,if(isTooltip): DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowIsTooltipFrame'><th><label for='isTooltipFrame'>Show Tooltips in Frames:</label></th><td><input type='checkbox' id='isTooltipFrame' name='isTooltipFrame' "+if(json.get(activeChatSettings,"isTooltipFrame")==1,"checked","")+"></td></tr>"]

[h,if(isTooltip): DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowIsTooltipMouseover'><th><label for='isTooltipMouseover'>Show Tooltips on Mouseover:</label></th><td><input type='checkbox' id='isTooltipMouseover' name='isTooltipMouseover' "+if(json.get(activeChatSettings,"isTooltipMouseover")==1,"checked","")+"></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowUseWidth'><th><label for='UseWidth'>Chat Width Options:</label></th><td><select id='UseWidth' name='UseWidth'><option value=0"+if(json.get(activeChatSettings,"UseWidth")==0," select","")+">Fixed Width</option><option value=1"+if(json.get(activeChatSettings,"UseWidth")==1," select","")+">No Width Limits</option><option value=2"+if(json.get(activeChatSettings,"UseWidth")==2," select","")+">Maximum Width</option></select></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDisplaySize'><th><label for='DisplaySize'>Chat Display Width:</label></th><td><input type='number' id='DisplaySize' name='DisplaySize' value='"+json.get(activeChatSettings,"DisplaySize")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowBodyFont'><th><label for='BodyFont'>Main Font:</label></th><td><select id='BodyFont' name='BodyFont'>"+FontOptionsHTML+"</select></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowTitleFont'><th><label for='TitleFont'>Title Font:</label></th><td><select id='TitleFont' name='TitleFont'>"+FontOptionsHTML+"</select></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowColorHeader'><th text-align='center' colspan='2'>Dark Mode Settings</th></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkBackground'><th><label for='DarkBackground'>Dark Mode Background Color:</label></th><td><input type='color' id='DarkBackground' name='DarkBackground' value='"+json.get(currentChatColors,"DarkBackground")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkText'><th><label for='DarkText'>Dark Mode Text Color:</label></th><td><input type='color' id='DarkText' name='DarkText' value='"+json.get(currentChatColors,"DarkText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkAccentBackground'><th><label for='DarkAccentBackground'>Dark Mode Accent Background Color:</label></th><td><input type='color' id='DarkAccentBackground' name='DarkAccentBackground' value='"+json.get(currentChatColors,"DarkAccentBackground")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkAccentText'><th><label for='DarkAccentText'>Dark Mode Accent Text Color:</label></th><td><input type='color' id='DarkAccentText' name='DarkAccentText' value='"+json.get(currentChatColors,"DarkAccentText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkDamageText'><th><label for='DarkDamageText'>Dark Mode Damage Color:</label></th><td><input type='color' id='DarkDamageText' name='DarkDamageText' value='"+json.get(currentChatColors,"DarkDamageText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkHealingText'><th><label for='DarkHealingText'>Dark Mode Healing Color:</label></th><td><input type='color' id='DarkHealingText' name='DarkHealingText' value='"+json.get(currentChatColors,"DarkHealingText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkFailureText'><th><label for='DarkFailureText'>Dark Mode Failure Color:</label></th><td><input type='color' id='DarkFailureText' name='DarkFailureText' value='"+json.get(currentChatColors,"DarkFailureText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkSuccessText'><th><label for='DarkSuccessText'>Dark Mode Success Color:</label></th><td><input type='color' id='DarkSuccessText' name='DarkSuccessText' value='"+json.get(currentChatColors,"DarkSuccessText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkCritText'><th><label for='DarkCritText'>Dark Mode Crit Color:</label></th><td><input type='color' id='DarkCritText' name='DarkCritText' value='"+json.get(currentChatColors,"DarkCritText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkCritFailText'><th><label for='DarkCritFailText'>Dark Mode Crit Fail Color:</label></th><td><input type='color' id='DarkCritFailText' name='DarkCritFailText' value='"+json.get(currentChatColors,"DarkCritFailText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowDarkLinkText'><th><label for='DarkLinkText'>Dark Mode Link Color:</label></th><td><input type='color' id='DarkLinkText' name='DarkLinkText' value='"+json.get(currentChatColors,"DarkLinkText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowColorHeader'><th text-align='center' colspan='2'>Light Mode Settings</th></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightBackground'><th><label for='LightBackground'>Light Mode Background Color:</label></th><td><input type='color' id='LightBackground' name='LightBackground' value='"+json.get(currentChatColors,"LightBackground")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightText'><th><label for='LightText'>Light Mode Text Color:</label></th><td><input type='color' id='LightText' name='LightText' value='"+json.get(currentChatColors,"LightText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightAccentBackground'><th><label for='LightAccentBackground'>Light Mode Accent Background Color:</label></th><td><input type='color' id='LightAccentBackground' name='LightAccentBackground' value='"+json.get(currentChatColors,"LightAccentBackground")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightAccentText'><th><label for='LightAccentText'>Light Mode Accent Text Color:</label></th><td><input type='color' id='LightAccentText' name='LightAccentText' value='"+json.get(currentChatColors,"LightAccentText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightDamageText'><th><label for='LightDamageText'>Light Mode Damage Color:</label></th><td><input type='color' id='LightDamageText' name='LightDamageText' value='"+json.get(currentChatColors,"LightDamageText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightHealingText'><th><label for='LightHealingText'>Light Mode Healing Color:</label></th><td><input type='color' id='LightHealingText' name='LightHealingText' value='"+json.get(currentChatColors,"LightHealingText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightFailureText'><th><label for='LightFailureText'>Light Mode Failure Color:</label></th><td><input type='color' id='LightFailureText' name='LightFailureText' value='"+json.get(currentChatColors,"LightFailureText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightSuccessText'><th><label for='LightSuccessText'>Light Mode Success Color:</label></th><td><input type='color' id='LightSuccessText' name='LightSuccessText' value='"+json.get(currentChatColors,"LightSuccessText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightCritText'><th><label for='LightCritText'>Light Mode Crit Color:</label></th><td><input type='color' id='LightCritText' name='LightCritText' value='"+json.get(currentChatColors,"LightCritText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightCritFailText'><th><label for='LightCritFailText'>Light Mode Crit Fail Color:</label></th><td><input type='color' id='LightCritFailText' name='LightCritFailText' value='"+json.get(currentChatColors,"LightCritFailText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowLightLinkText'><th><label for='LightLinkText'>Light Mode Link Color:</label></th><td><input type='color' id='LightLinkText' name='LightLinkText' value='"+json.get(currentChatColors,"LightLinkText")+"'></td></tr>"]

[h:DisplaySettingsHTML = DisplaySettingsHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'></tr>"]

[h:html.dialog5("DisplaySettings","lib://pm.a5e.core/DisplaySettings.html?cachelib=false","value="+base64.encode(DisplaySettingsHTML)+"; closebutton=0; height=800")]