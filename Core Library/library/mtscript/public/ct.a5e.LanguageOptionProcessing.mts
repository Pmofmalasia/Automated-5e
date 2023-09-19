[h:inputData = arg(0)]

[h,if(json.get(inputData,"LanguageOptions") == 0): inputData = json.remove(inputData,"LanguageOptions")]
[h:LanguageKnownNumber = json.get(inputData,"LanguageKnownNumber")]
[h:inputData = json.remove(inputData,"LanguageKnownNumber")]
[h:LanguagesKnown = ""]
[h,count(LanguageKnownNumber + 1),CODE:{
	[h:thisLanguage = json.get(inputData,"LanguageKnown"+roll.count)]
	[h:LanguagesKnown = json.set(LanguagesKnown,thisLanguage,1)]
	[h:inputData = json.remove(inputData,"LanguageKnown"+roll.count)]
}]
[h,if(LanguagesKnown != ""): inputData = json.set(inputData,"Languages",LanguagesKnown)]

[h:return(0,inputData)]