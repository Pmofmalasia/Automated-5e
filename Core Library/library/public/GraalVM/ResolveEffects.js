function resolveEffects(effect){
	let allActiveEffects = MTScript.evalMacro("[h:data.getData('addon:','pm.a5e.core','gd.Effects')]");
	let effectsToResolve = effect.ToResolve;

	let ParentTokenID = effect.ParentToken;
	let ParentToken;
	try {
		ParentToken = MapTool.tokens.getMapTokenByID(ParentTokenID);
	} catch (error) {
		ParentToken = null;
	}

	let targets = effect.Targets;
	targets = MTScript.evalMacro("[h:json.intersection(getTokens('json'),'"+targets+"')]");
	let conditionGroupID = MTScript.evalMacro(`[h:pm.a5e.CreateConditionID(${ParentTokenID},${targets})]`);
	let transformationGroupID = MTScript.evalMacro(`[h:pm.a5e.CreateConditionID(${ParentTokenID},${targets})]`);
}

function checkParentSubeffectRequirements(effectData){
	let ParentEffectData = effectData.ParentEffectData;
	let parentRequirementsData = effectData.ParentSubeffectRequirements;
	let parentRequirementType = parentRequirementsData.Requirement;

	let metParentReqTest = true;
	if(parentRequirementType === "Attack"){
		let needsHitorMiss = parentRequirementsData.Result;
		let hitRequirementMet = (needsHitorMiss === ParentEffectData.AttackHit);
		if(hitRequirementMet){
			let AttackHitMargin = (ParentEffectData.AttackToHit = ParentEffectData.AttackACToHit);
			if(needsHitorMiss === "Miss"){
				AttackHitMargin = AttackHitMargin * -1;
			}

			if(AttackHitMargin < parentRequirementsData.Margin){
				metParentReqTest = false;
			}
		}
		else{
			metParentReqTest = false;
		}
	}
	else if(parentRequirementType === "Check" || parentRequirementType === "Save"){
		let needsPassorFail = parentRequirementsData.Result;
		let passRequirementMet = (ParentEffectData[parentRequirementType+"Passed"] === needsPassorFail);
		if(passRequirementMet){
			let TestPassedMargin = (ParentEffectData[parentRequirementType+"Value"] = ParentEffectData[parentRequirementType+"DCValue"]);
			if(needsPassorFail === "Fail"){
				TestPassedMargin = TestPassedMargin * -1;
			}

			if(TestPassedMargin < parentRequirementsData.Margin){
				metParentReqTest = false;
			}
		}
		else{
			metParentReqTest = false;
		}
	}

	let useParentCrit = true;
	if(effect.ParentCrit === undefined){
		useParentCrit = false;
	}
	
	//TODO: Add additional requirements
	return {
		ParentCrit:useParentCrit,
		ParentReqMet:metParentReqTest
	}
}