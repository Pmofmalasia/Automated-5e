[h:tempOutputSettings = arg(0)]
[h:isTooltip = arg(1)]
[h:isVertical = json.get(tempOutputSettings,"VerticalDisplay")]
[h:isDarkMode = json.get(tempOutputSettings,"DarkMode")]
[h:TitleFont = json.get(tempOutputSettings,"TitleFont")]
[h:BodyFont = json.get(tempOutputSettings,"BodyFont")]

[h:tempOutputColors = json.get(tempOutputSettings,"ChatColors")]
[h,if(isDarkMode),CODE:{
	[h:BackgroundColor = json.get(tempOutputColors,"DarkBackground")]
	[h:BackgroundTextColor = json.get(tempOutputColors,"DarkText")]
	[h:AccentBackground = json.get(tempOutputColors,"DarkAccentBackground")]
	[h:AccentText = json.get(tempOutputColors,"DarkAccentText")]
	[h:DamageTextColor = json.get(tempOutputColors,"DarkDamageText")]
	[h:HealingTextColor = json.get(tempOutputColors,"DarkHealingText")]
	[h:FailureTextColor = json.get(tempOutputColors,"DarkFailureText")]
	[h:SuccessTextColor = json.get(tempOutputColors,"DarkSuccessText")]
	[h:CritTextColor = json.get(tempOutputColors,"DarkCritText")]
	[h:CritFailTextColor = json.get(tempOutputColors,"DarkCritFailText")]
	[h:LinkTextColor = json.get(tempOutputColors,"DarkLinkColor")]
};{
	[h:BackgroundColor = json.get(tempOutputColors,"LightBackground")]
	[h:BackgroundTextColor = json.get(tempOutputColors,"LightText")]
	[h:AccentBackground = json.get(tempOutputColors,"LightAccentBackground")]
	[h:AccentText = json.get(tempOutputColors,"LightAccentText")]
	[h:DamageTextColor = json.get(tempOutputColors,"LightDamageText")]
	[h:HealingTextColor = json.get(tempOutputColors,"LightHealingText")]
	[h:FailureTextColor = json.get(tempOutputColors,"LightFailureText")]
	[h:SuccessTextColor = json.get(tempOutputColors,"LightSuccessText")]
	[h:CritTextColor = json.get(tempOutputColors,"LightCritText")]
	[h:CritFailTextColor = json.get(tempOutputColors,"LightCritFailText")]
	[h:LinkTextColor = json.get(tempOutputColors,"LightLinkColor")]
}]

[h:AccentFormat = "text-align:center; background-color:"+AccentBackground+"; color:"+AccentText+";" + if(isVertical,"width:100%"," width:20%;")]
[h:VerticalFormat = if(isVertical,"</th></tr><tr style='text-align:center;'><td style='","</th><td style='padding-left:4px; valign:middle;")]
[h:VerticalFormatFinalBonus = if(isVertical,"</td></tr><tr style='text-align:center;'><td style='","</td><td style='padding-left:4px; valign:middle; text-align:right")]
[h:ColNumFormat = if(isVertical,"","; colspan='"+MaxColNum+"'")]
[h:VerticalListFormat = if(isVertical,"<br>",", ")]

[h:"<!-- Note: switch is used here because in the past there were options to limit to max-width as well (doesn't work with this version of CSS though). Leaving it for the future in case options are reintroduced. -->"]
[h,switch(json.get(tempOutputSettings,"UseWidth")):
	case 0: TableWidth = "width:"+string(json.get(tempOutputSettings,"DisplaySize"))+"px;";
	case 1: TableWidth = ""
]
[h:TableFormat = "color:"+BackgroundTextColor+"; padding:3px; "+if(isVertical,"width:100%; ",TableWidth)]