[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:ForcedSkill=json.get(macro.args,"ForcedSkill")]

<!-- Note: as is, magic item proficiency in all checks of an ability do not stack with magic item proficiency in subtypes of that ability. Not sure whether they should or not, or if it even matters since its unlikely to ever be relevant anyway. -->

<!-- Magic Item bonuses arent swapping though and that probably does need fixing. -->

[h:Acb=max(if(json.get(MagicItemStats,"iDexCheckProf")==3,max(1,json.get(Skills,"Acb")),min(2,json.get(Skills,"Acb")+json.get(MagicItemStats,"iDexCheckProf"))),if(json.get(MagicItemStats,"iAcbCheckProf")==3,max(1,json.get(Skills,"Acb")),min(2,json.get(Skills,"Acb")+json.get(MagicItemStats,"iAcbCheckProf"))))]
[h:AnH=max(if(json.get(MagicItemStats,"iWisCheckProf")==3,max(1,json.get(Skills,"AnH")),min(2,json.get(Skills,"AnH")+json.get(MagicItemStats,"iWisCheckProf"))),if(json.get(MagicItemStats,"iAnHCheckProf")==3,max(1,json.get(Skills,"AnH")),min(2,json.get(Skills,"AnH")+json.get(MagicItemStats,"iAnHCheckProf"))))]
[h:Arc=max(if(json.get(MagicItemStats,"iIntCheckProf")==3,max(1,json.get(Skills,"Arc")),min(2,json.get(Skills,"Arc")+json.get(MagicItemStats,"iIntCheckProf"))),if(json.get(MagicItemStats,"iArcCheckProf")==3,max(1,json.get(Skills,"Arc")),min(2,json.get(Skills,"Arc")+json.get(MagicItemStats,"iArcCheckProf"))))]
[h:Ath=max(if(json.get(MagicItemStats,"iStrCheckProf")==3,max(1,json.get(Skills,"Ath")),min(2,json.get(Skills,"Ath")+json.get(MagicItemStats,"iStrCheckProf"))),if(json.get(MagicItemStats,"iAthCheckProf")==3,max(1,json.get(Skills,"Ath")),min(2,json.get(Skills,"Ath")+json.get(MagicItemStats,"iAthCheckProf"))))]
[h:Dcp=max(if(json.get(MagicItemStats,"iChaCheckProf")==3,max(1,json.get(Skills,"Dcp")),min(2,json.get(Skills,"Dcp")+json.get(MagicItemStats,"iChaCheckProf"))),if(json.get(MagicItemStats,"iDcpCheckProf")==3,max(1,json.get(Skills,"Dcp")),min(2,json.get(Skills,"Dcp")+json.get(MagicItemStats,"iDcpCheckProf"))))]
[h:Hst=max(if(json.get(MagicItemStats,"iIntCheckProf")==3,max(1,json.get(Skills,"Hst")),min(2,json.get(Skills,"Hst")+json.get(MagicItemStats,"iIntCheckProf"))),if(json.get(MagicItemStats,"iHstCheckProf")==3,max(1,json.get(Skills,"Hst")),min(2,json.get(Skills,"Hst")+json.get(MagicItemStats,"iHstCheckProf"))))]
[h:Ins=max(if(json.get(MagicItemStats,"iWisCheckProf")==3,max(1,json.get(Skills,"Ins")),min(2,json.get(Skills,"Ins")+json.get(MagicItemStats,"iWisCheckProf"))),if(json.get(MagicItemStats,"iInsCheckProf")==3,max(1,json.get(Skills,"Ins")),min(2,json.get(Skills,"Ins")+json.get(MagicItemStats,"iInsCheckProf"))))]
[h:Imd=max(if(json.get(MagicItemStats,"iChaCheckProf")==3,max(1,json.get(Skills,"Imd")),min(2,json.get(Skills,"Imd")+json.get(MagicItemStats,"iChaCheckProf"))),if(json.get(MagicItemStats,"iImdCheckProf")==3,max(1,json.get(Skills,"Imd")),min(2,json.get(Skills,"Imd")+json.get(MagicItemStats,"iImdCheckProf"))))]
[h:Inv=max(if(json.get(MagicItemStats,"iIntCheckProf")==3,max(1,json.get(Skills,"Inv")),min(2,json.get(Skills,"Inv")+json.get(MagicItemStats,"iIntCheckProf"))),if(json.get(MagicItemStats,"iInvCheckProf")==3,max(1,json.get(Skills,"Inv")),min(2,json.get(Skills,"Inv")+json.get(MagicItemStats,"iInvCheckProf"))))]
[h:Med=max(if(json.get(MagicItemStats,"iWisCheckProf")==3,max(1,json.get(Skills,"Med")),min(2,json.get(Skills,"Med")+json.get(MagicItemStats,"iWisCheckProf"))),if(json.get(MagicItemStats,"iMedCheckProf")==3,max(1,json.get(Skills,"Med")),min(2,json.get(Skills,"Med")+json.get(MagicItemStats,"iMedCheckProf"))))]
[h:Ntr=max(if(json.get(MagicItemStats,"iIntCheckProf")==3,max(1,json.get(Skills,"Ntr")),min(2,json.get(Skills,"Ntr")+json.get(MagicItemStats,"iIntCheckProf"))),if(json.get(MagicItemStats,"iNtrCheckProf")==3,max(1,json.get(Skills,"Ntr")),min(2,json.get(Skills,"Ntr")+json.get(MagicItemStats,"iNtrCheckProf"))))]
[h:Pcp=max(if(json.get(MagicItemStats,"iWisCheckProf")==3,max(1,json.get(Skills,"Pcp")),min(2,json.get(Skills,"Pcp")+json.get(MagicItemStats,"iWisCheckProf"))),if(json.get(MagicItemStats,"iPcpCheckProf")==3,max(1,json.get(Skills,"Pcp")),min(2,json.get(Skills,"Pcp")+json.get(MagicItemStats,"iPcpCheckProf"))))]
[h:Pfm=max(if(json.get(MagicItemStats,"iChaCheckProf")==3,max(1,json.get(Skills,"Pfm")),min(2,json.get(Skills,"Pfm")+json.get(MagicItemStats,"iChaCheckProf"))),if(json.get(MagicItemStats,"iPfmCheckProf")==3,max(1,json.get(Skills,"Pfm")),min(2,json.get(Skills,"Pfm")+json.get(MagicItemStats,"iPfmCheckProf"))))]
[h:Prs=max(if(json.get(MagicItemStats,"iChaCheckProf")==3,max(1,json.get(Skills,"Prs")),min(2,json.get(Skills,"Prs")+json.get(MagicItemStats,"iChaCheckProf"))),if(json.get(MagicItemStats,"iPrsCheckProf")==3,max(1,json.get(Skills,"Prs")),min(2,json.get(Skills,"Prs")+json.get(MagicItemStats,"iPrsCheckProf"))))]
[h:Rlg=max(if(json.get(MagicItemStats,"iIntCheckProf")==3,max(1,json.get(Skills,"Rlg")),min(2,json.get(Skills,"Rlg")+json.get(MagicItemStats,"iIntCheckProf"))),if(json.get(MagicItemStats,"iRlgCheckProf")==3,max(1,json.get(Skills,"Rlg")),min(2,json.get(Skills,"Rlg")+json.get(MagicItemStats,"iRlgCheckProf"))))]
[h:SoH=max(if(json.get(MagicItemStats,"iDexCheckProf")==3,max(1,json.get(Skills,"SoH")),min(2,json.get(Skills,"SoH")+json.get(MagicItemStats,"iDexCheckProf"))),if(json.get(MagicItemStats,"iSoHCheckProf")==3,max(1,json.get(Skills,"SoH")),min(2,json.get(Skills,"SoH")+json.get(MagicItemStats,"iSoHCheckProf"))))]
[h:Stl=max(if(json.get(MagicItemStats,"iDexCheckProf")==3,max(1,json.get(Skills,"Stl")),min(2,json.get(Skills,"Stl")+json.get(MagicItemStats,"iDexCheckProf"))),if(json.get(MagicItemStats,"iStlCheckProf")==3,max(1,json.get(Skills,"Stl")),min(2,json.get(Skills,"Stl")+json.get(MagicItemStats,"iStlCheckProf"))))]
[h:Srv=max(if(json.get(MagicItemStats,"iWisCheckProf")==3,max(1,json.get(Skills,"Srv")),min(2,json.get(Skills,"Srv")+json.get(MagicItemStats,"iWisCheckProf"))),if(json.get(MagicItemStats,"iSrvCheckProf")==3,max(1,json.get(Skills,"Srv")),min(2,json.get(Skills,"Srv")+json.get(MagicItemStats,"iSrvCheckProf"))))]

[h:ArT=json.get(Tools,"ArT")]
[h:DsK=json.get(Tools,"DsK")]
[h:FgK=json.get(Tools,"FgK")]
[h:GmS=json.get(Tools,"GmS")]
[h:HbK=json.get(Tools,"HbK")]
[h:MsI=json.get(Tools,"MsI")]
[h:NgT=json.get(Tools,"NgT")]
[h:PsK=json.get(Tools,"PsK")]
[h:TvT=json.get(Tools,"TvT")]

[h:roll1=1d20]
[h:roll2=1d20]
[h:NO=0]
[h:SkillBonus=0]

[h:mStrBonus=0]
[h:mDexBonus=0]
[h:mConBonus=0]
[h:mIntBonus=0]
[h:mWisBonus=0]
[h:mChaBonus=0]
[h:mAcbBonus=0]
[h:mAnHBonus=0]
[h:mArcBonus=0]
[h:mAthBonus=0]
[h:mDcpBonus=0]
[h:mHstBonus=0]
[h:mInsBonus=0]
[h:mImdBonus=0]
[h:mInvBonus=0]
[h:mMedBonus=0]
[h:mNtrBonus=0]
[h:mPcpBonus=0]
[h:mPfmBonus=0]
[h:mPrsBonus=0]
[h:mRlgBonus=0]
[h:mSoHBonus=0]
[h:mStlBonus=0]
[h:mSrvBonus=0]
[h,foreach(bonus,json.get(MagicItemStats,"iStrCheckBonus")),CODE:{[mStrBonus=mStrBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexCheckBonus")),CODE:{[mDexBonus=mDexBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConCheckBonus")),CODE:{[mConBonus=mConBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntCheckBonus")),CODE:{[mIntBonus=mIntBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisCheckBonus")),CODE:{[mWisBonus=mWisBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaCheckBonus")),CODE:{[mChaBonus=mChaBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAcbCheckBonus")),CODE:{[mAcbBonus=mAcbBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAnHCheckBonus")),CODE:{[mAnHBonus=mAnHBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iArcCheckBonus")),CODE:{[mArcBonus=mArcBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAthCheckBonus")),CODE:{[mAthBonus=mAthBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDcpCheckBonus")),CODE:{[mDcpBonus=mDcpBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iHstCheckBonus")),CODE:{[mHstBonus=mHstBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInsCheckBonus")),CODE:{[mInsBonus=mInsBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iImdCheckBonus")),CODE:{[mImdBonus=mImdBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInvCheckBonus")),CODE:{[mInvBonus=mInvBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iMedCheckBonus")),CODE:{[mMedBonus=mMedBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iNtrCheckBonus")),CODE:{[mNtrBonus=mNtrBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPcpCheckBonus")),CODE:{[mPcpBonus=mPcpBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPfmCheckBonus")),CODE:{[mPfmBonus=mPfmBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPrsCheckBonus")),CODE:{[mPrsBonus=mPrsBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iRlgCheckBonus")),CODE:{[mRlgBonus=mRlgBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSoHCheckBonus")),CODE:{[mSoHBonus=mSoHBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iStlCheckBonus")),CODE:{[mStlBonus=mStlBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSrvCheckBonus")),CODE:{[mSrvBonus=mSrvBonus+bonus]}]
[h:mStrBonusStr=""]
[h:mDexBonusStr=""]
[h:mConBonusStr=""]
[h:mIntBonusStr=""]
[h:mWisBonusStr=""]
[h:mChaBonusStr=""]
[h:mAcbBonusStr=""]
[h:mAnHBonusStr=""]
[h:mArcBonusStr=""]
[h:mAthBonusStr=""]
[h:mDcpBonusStr=""]
[h:mHstBonusStr=""]
[h:mInsBonusStr=""]
[h:mImdBonusStr=""]
[h:mInvBonusStr=""]
[h:mMedBonusStr=""]
[h:mNtrBonusStr=""]
[h:mPcpBonusStr=""]
[h:mPfmBonusStr=""]
[h:mPrsBonusStr=""]
[h:mRlgBonusStr=""]
[h:mSoHBonusStr=""]
[h:mStlBonusStr=""]
[h:mSrvBonusStr=""]
[h,foreach(bonus,json.get(MagicItemStats,"iStrCheckBonus")),CODE:{[mStrBonusStr=mStrBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexCheckBonus")),CODE:{[mDexBonusStr=mDexBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConCheckBonus")),CODE:{[mConBonusStr=mConBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntCheckBonus")),CODE:{[mIntBonusStr=mIntBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisCheckBonus")),CODE:{[mWisBonusStr=mWisBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaCheckBonus")),CODE:{[mChaBonusStr=mChaBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAcbCheckBonus")),CODE:{[mAcbBonusStr=mAcbBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAnHCheckBonus")),CODE:{[mAnHBonusStr=mAnHBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iArcCheckBonus")),CODE:{[mArcBonusStr=mArcBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAthCheckBonus")),CODE:{[mAthBonusStr=mAthBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDcpCheckBonus")),CODE:{[mDcpBonusStr=mDcpBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iHstCheckBonus")),CODE:{[mHstBonusStr=mHstBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInsCheckBonus")),CODE:{[mInsBonusStr=mInsBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iImdCheckBonus")),CODE:{[mImdBonusStr=mImdBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInvCheckBonus")),CODE:{[mInvBonusStr=mInvBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iMedCheckBonus")),CODE:{[mMedBonusStr=mMedBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iNtrCheckBonus")),CODE:{[mNtrBonusStr=mNtrBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPcpCheckBonus")),CODE:{[mPcpBonusStr=mPcpBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPfmCheckBonus")),CODE:{[mPfmBonusStr=mPfmBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPrsCheckBonus")),CODE:{[mPrsBonusStr=mPrsBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iRlgCheckBonus")),CODE:{[mRlgBonusStr=mRlgBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSoHCheckBonus")),CODE:{[mSoHBonusStr=mSoHBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iStlCheckBonus")),CODE:{[mStlBonusStr=mStlBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSrvCheckBonus")),CODE:{[mSrvBonusStr=mSrvBonusStr+if(bonus>=0," + "," - ")+abs(bonus)]}]
[h:mStrAdv=""]
[h:mDexAdv=""]
[h:mConAdv=""]
[h:mIntAdv=""]
[h:mWisAdv=""]
[h:mChaAdv=""]
[h:mAcbAdv=""]
[h:mAnHAdv=""]
[h:mArcAdv=""]
[h:mAthAdv=""]
[h:mDcpAdv=""]
[h:mHstAdv=""]
[h:mInsAdv=""]
[h:mImdAdv=""]
[h:mInvAdv=""]
[h:mMedAdv=""]
[h:mNtrAdv=""]
[h:mPcpAdv=""]
[h:mPfmAdv=""]
[h:mPrsAdv=""]
[h:mRlgAdv=""]
[h:mSoHAdv=""]
[h:mStlAdv=""]
[h:mSrvAdv=""]
[h,foreach(bonus,json.get(MagicItemStats,"iStrCheckAdv")),CODE:{[mStrAdv=listAppend(mStrAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexCheckAdv")),CODE:{[mDexAdv=listAppend(mDexAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConCheckAdv")),CODE:{[mConAdv=listAppend(mConAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntCheckAdv")),CODE:{[mIntAdv=listAppend(mIntAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisCheckAdv")),CODE:{[mWisAdv=listAppend(mWisAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaCheckAdv")),CODE:{[mChaAdv=listAppend(mChaAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAcbCheckAdv")),CODE:{[mAcbAdv=listAppend(mAcbAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAnHCheckAdv")),CODE:{[mAnHAdv=listAppend(mAnHAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iArcCheckAdv")),CODE:{[mArcAdv=listAppend(mArcAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAthCheckAdv")),CODE:{[mAthAdv=listAppend(mAthAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDcpCheckAdv")),CODE:{[mDcpAdv=listAppend(mDcpAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iHstCheckAdv")),CODE:{[mHstAdv=listAppend(mHstAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInsCheckAdv")),CODE:{[mInsAdv=listAppend(mInsAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iImdCheckAdv")),CODE:{[mImdAdv=listAppend(mImdAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInvCheckAdv")),CODE:{[mInvAdv=listAppend(mInvAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iMedCheckAdv")),CODE:{[mMedAdv=listAppend(mMedAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iNtrCheckAdv")),CODE:{[mNtrAdv=listAppend(mNtrAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPcpCheckAdv")),CODE:{[mPcpAdv=listAppend(mPcpAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPfmCheckAdv")),CODE:{[mPfmAdv=listAppend(mPfmAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPrsCheckAdv")),CODE:{[mPrsAdv=listAppend(mPrsAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iRlgCheckAdv")),CODE:{[mRlgAdv=listAppend(mRlgAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSoHCheckAdv")),CODE:{[mSoHAdv=listAppend(mSoHAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iStlCheckAdv")),CODE:{[mStlAdv=listAppend(mStlAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSrvCheckAdv")),CODE:{[mSrvAdv=listAppend(mSrvAdv,bonus)]}]
[h:mStrDis=""]
[h:mDexDis=""]
[h:mConDis=""]
[h:mIntDis=""]
[h:mWisDis=""]
[h:mChaDis=""]
[h:mAcbDis=""]
[h:mAnHDis=""]
[h:mArcDis=""]
[h:mAthDis=""]
[h:mDcpDis=""]
[h:mHstDis=""]
[h:mInsDis=""]
[h:mImdDis=""]
[h:mInvDis=""]
[h:mMedDis=""]
[h:mNtrDis=""]
[h:mPcpDis=""]
[h:mPfmDis=""]
[h:mPrsDis=""]
[h:mRlgDis=""]
[h:mSoHDis=""]
[h:mStlDis=""]
[h:mSrvDis=""]
[h,foreach(bonus,json.get(MagicItemStats,"iStrCheckDis")),CODE:{[mStrDis=listAppend(mStrDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexCheckDis")),CODE:{[mDexDis=listAppend(mDexDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConCheckDis")),CODE:{[mConDis=listAppend(mConDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntCheckDis")),CODE:{[mIntDis=listAppend(mIntDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisCheckDis")),CODE:{[mWisDis=listAppend(mWisDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaCheckDis")),CODE:{[mChaDis=listAppend(mChaDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAcbCheckDis")),CODE:{[mAcbDis=listAppend(mAcbDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAnHCheckDis")),CODE:{[mAnHDis=listAppend(mAnHDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iArcCheckDis")),CODE:{[mArcDis=listAppend(mArcDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAthCheckDis")),CODE:{[mAthDis=listAppend(mAthDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDcpCheckDis")),CODE:{[mDcpDis=listAppend(mDcpDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iHstCheckDis")),CODE:{[mHstDis=listAppend(mHstDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInsCheckDis")),CODE:{[mInsDis=listAppend(mInsDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iImdCheckDis")),CODE:{[mImdDis=listAppend(mImdDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInvCheckDis")),CODE:{[mInvDis=listAppend(mInvDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iMedCheckDis")),CODE:{[mMedDis=listAppend(mMedDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iNtrCheckDis")),CODE:{[mNtrDis=listAppend(mNtrDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPcpCheckDis")),CODE:{[mPcpDis=listAppend(mPcpDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPfmCheckDis")),CODE:{[mPfmDis=listAppend(mPfmDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPrsCheckDis")),CODE:{[mPrsDis=listAppend(mPrsDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iRlgCheckDis")),CODE:{[mRlgDis=listAppend(mRlgDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSoHCheckDis")),CODE:{[mSoHDis=listAppend(mSoHDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iStlCheckDis")),CODE:{[mStlDis=listAppend(mStlDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSrvCheckDis")),CODE:{[mSrvDis=listAppend(mSrvDis,bonus)]}]
[h:mStrMessage=""]
[h:mDexMessage=""]
[h:mConMessage=""]
[h:mIntMessage=""]
[h:mWisMessage=""]
[h:mChaMessage=""]
[h:mAcbMessage=""]
[h:mAnHMessage=""]
[h:mArcMessage=""]
[h:mAthMessage=""]
[h:mDcpMessage=""]
[h:mHstMessage=""]
[h:mInsMessage=""]
[h:mImdMessage=""]
[h:mInvMessage=""]
[h:mMedMessage=""]
[h:mNtrMessage=""]
[h:mPcpMessage=""]
[h:mPfmMessage=""]
[h:mPrsMessage=""]
[h:mRlgMessage=""]
[h:mSoHMessage=""]
[h:mStlMessage=""]
[h:mSrvMessage=""]
[h,foreach(bonus,json.get(MagicItemStats,"iStrCheckMessage")),CODE:{[mStrMessage=listAppend(mStrMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexCheckMessage")),CODE:{[mDexMessage=listAppend(mDexMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConCheckMessage")),CODE:{[mConMessage=listAppend(mConMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntCheckMessage")),CODE:{[mIntMessage=listAppend(mIntMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisCheckMessage")),CODE:{[mWisMessage=listAppend(mWisMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaCheckMessage")),CODE:{[mChaMessage=listAppend(mChaMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAcbCheckMessage")),CODE:{[mAcbMessage=listAppend(mAcbMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAnHCheckMessage")),CODE:{[mAnHMessage=listAppend(mAnHMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iArcCheckMessage")),CODE:{[mArcMessage=listAppend(mArcMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iAthCheckMessage")),CODE:{[mAthMessage=listAppend(mAthMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDcpCheckMessage")),CODE:{[mDcpMessage=listAppend(mDcpMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iHstCheckMessage")),CODE:{[mHstMessage=listAppend(mHstMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInsCheckMessage")),CODE:{[mInsMessage=listAppend(mInsMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iImdCheckMessage")),CODE:{[mImdMessage=listAppend(mImdMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iInvCheckMessage")),CODE:{[mInvMessage=listAppend(mInvMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iMedCheckMessage")),CODE:{[mMedMessage=listAppend(mMedMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iNtrCheckMessage")),CODE:{[mNtrMessage=listAppend(mNtrMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPcpCheckMessage")),CODE:{[mPcpMessage=listAppend(mPcpMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPfmCheckMessage")),CODE:{[mPfmMessage=listAppend(mPfmMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iPrsCheckMessage")),CODE:{[mPrsMessage=listAppend(mPrsMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iRlgCheckMessage")),CODE:{[mRlgMessage=listAppend(mRlgMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSoHCheckMessage")),CODE:{[mSoHMessage=listAppend(mSoHMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iStlCheckMessage")),CODE:{[mStlMessage=listAppend(mStlMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iSrvCheckMessage")),CODE:{[mSrvMessage=listAppend(mSrvMessage,bonus,"##")]}]

[h:bStr=json.get(AtrMods, "Strength")+mStrBonus+max(if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lStr=if(bStr>-1,"+","")][h:lStr=lStr+bStr+" - Strength Check"]
[h:bDex=mDexBonus+json.get(AtrMods, "Dexterity")+max(if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lDex=if(bDex>-1,"+","")][h:lDex=lDex+bDex+" - Dexterity Check"]
[h:bCon=mConBonus+json.get(AtrMods, "Constitution")+max(if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lCon=if(bCon>-1,"+","")][h:lCon=lCon+bCon+" - Constitution Check"]
[h:bInt=mIntBonus+json.get(AtrMods, "Intelligence")+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0)][h:lInt=if(bInt>-1,"+","")][h:lInt=lInt+bInt+" - Intelligence Check"]
[h:bWis=mWisBonus+json.get(AtrMods, "Wisdom")+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0)][h:lWis=if(bWis>-1,"+","")][h:lWis=lWis+bWis+" - Wisdom Check"]
[h:bCha=mChaBonus+json.get(AtrMods, "Charisma")+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0)][h:lCha=if(bCha>-1,"+","")][h:lCha=lCha+bCha+" - Charisma Check"]

[h:bAcb=json.get(AtrMods, "Dexterity")+mAcbBonus+mDexBonus+max(Acb*Proficiency,if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lAcb=if(bAcb>-1,"+","")][h:lAcb=lAcb+bAcb+" - Acrobatics (Dex)"]
[h:bAnH=json.get(AtrMods, "Wisdom")+mAnHBonus+mWisBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(AnH==0,1/2,AnH),AnH))][h:lAnH=if(bAnH>-1,"+","")][h:lAnH=lAnH+bAnH+" - Animal Handling (Wis)"]
[h:bArc=json.get(AtrMods, "Intelligence")+mArcBonus+mIntBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Arc==0,1/2,Arc),Arc))][h:lArc=if(bArc>-1,"+","")][h:lArc=lArc+bArc+" - Arcana (Int)"]
[h:bAth=json.get(AtrMods, "Strength")+mAthBonus+mStrBonus+max(Ath*Proficiency,if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lAth=if(bAth>-1,"+","")][h:lAth=lAth+bAth+" - Athletics (Str)"]
[h:bDcp=json.get(AtrMods, "Charisma")+mDcpBonus+mChaBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Dcp==0,1/2,Dcp),Dcp))][h:lDcp=if(bDcp>-1,"+","")][h:lDcp=lDcp+bDcp+" - Deception (Cha)"]
[h:bHst=json.get(AtrMods, "Intelligence")+mHstBonus+mIntBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Hst==0,1/2,Hst),Hst))][h:lHst=if(bHst>-1,"+","")][h:lHst=lHst+bHst+" - History (Int)"]
[h:bIns=json.get(AtrMods, "Wisdom")+mInsBonus+mWisBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Ins==0,1/2,Ins),Ins))][h:lIns=if(bIns>-1,"+","")][h:lIns=lIns+bIns+" - Insight (Wis)"]
[h:bImd=json.get(AtrMods, "Charisma")+mImdBonus+mChaBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Imd==0,1/2,Imd),Imd))][h:lImd=if(bImd>-1,"+","")][h:lImd=lImd+bImd+" - Intimidation (Cha)"]
[h:bInv=json.get(AtrMods, "Intelligence")+mInvBonus+mIntBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Inv==0,1/2,Inv),Inv))][h:lInv=if(bInv>-1,"+","")][h:lInv=lInv+bInv+" - Investigation (Int)"]
[h:bMed=json.get(AtrMods, "Wisdom")+mMedBonus+mWisBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Med==0,1/2,Med),Med))][h:lMed=if(bMed>-1,"+","")][h:lMed=lMed+bMed+" - Medicine (Wis)"]
[h:bNtr=json.get(AtrMods, "Intelligence")+mNtrBonus+mIntBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Ntr==0,1/2,Ntr),Ntr))][h:lNtr=if(bNtr>-1,"+","")][h:lNtr=lNtr+bNtr+" - Nature (Int)"]
[h:bPcp=json.get(AtrMods, "Wisdom")+mPcpBonus+mWisBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Pcp==0,1/2,Pcp),Pcp))][h:lPcp=if(bPcp>-1,"+","")][h:lPcp=lPcp+bPcp+" - Perception (Wis)"]
[h:bPfm=json.get(AtrMods, "Charisma")+mPfmBonus+mChaBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Pfm==0,1/2,Pfm),Pfm))][h:lPfm=if(bPfm>-1,"+","")][h:lPfm=lPfm+bPfm+" - Performance (Cha)"]
[h:bPrs=json.get(AtrMods, "Charisma")+mPrsBonus+mChaBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Prs==0,1/2,Prs),Prs))][h:lPrs=if(bPrs>-1,"+","")][h:lPrs=lPrs+bPrs+" - Persuasion (Cha)"]
[h:bRlg=json.get(AtrMods, "Intelligence")+mRlgBonus+mIntBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Rlg==0,1/2,Rlg),Rlg))][h:lRlg=if(bRlg>-1,"+","")][h:lRlg=lRlg+bRlg+" - Religion (Int)"]
[h:bSoH=json.get(AtrMods, "Dexterity")+mSoHBonus+mDexBonus+max(SoH*Proficiency,if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lSoH=if(bSoH>-1,"+","")][h:lSoH=lSoH+bSoH+" - Sleight of Hand (Dex)"]
[h:bStl=json.get(AtrMods, "Dexterity")+mStlBonus+mDexBonus+max(Stl*Proficiency,if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lStl=if(bStl>-1,"+","")][h:lStl=lStl+bStl+" - Stealth (Dex)"]
[h:bSrv=json.get(AtrMods, "Wisdom")+mSrvBonus+mWisBonus+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(Srv==0,1/2,Srv),Srv))][h:lSrv=if(bSrv>-1,"+","")][h:lSrv=lSrv+bSrv+" - Survival (Wis)"]

[h:bArT=json.get(AtrMods, "Dexterity")+max(ArT*Proficiency,if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lArT=if(bArT>-1,"+","")][h:lArT=lArT+bArT+" - Artisan's Tools (Dex)"]
[h:bDsK=json.get(AtrMods, "Charisma")+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(DsK==0,1/2,DsK),DsK))][h:lDsK=if(bDsK>-1,"+","")][h:lDsK=lDsK+bDsK+" - Disguise Kit (Cha)"]
[h:bFgK=json.get(AtrMods, "Intelligence")+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(FgK==0,1/2,FgK),FgK))][h:lFgK=if(bFgK>-1,"+","")][h:lFgK=lFgK+bFgK+" - Forgery Kit (Int)"]
[h:bGmS=json.get(AtrMods, "Dexterity")+max(GmS*Proficiency,if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lGmS=if(bGmS>-1,"+","")][h:lGmS=lGmS+bGmS+" - Gaming Set (Dex)"]
[h:bHbK=json.get(AtrMods, "Wisdom")+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(HbK==0,1/2,HbK),HbK))][h:lHbK=if(bHbK>-1,"+","")][h:lHbK=lHbK+bHbK+" - Herbalism Kit (Wis)"]
[h:bMsI=json.get(AtrMods, "Charisma")+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(MsI==0,1/2,MsI),MsI))][h:lMsI=if(bMsI>-1,"+","")][h:lMsI=lMsI+bMsI+" - Musical Instrument (Cha)"]
[h:bNgT=json.get(AtrMods, "Intelligence")+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(NgT==0,1/2,NgT),NgT))][h:lNgT=if(bNgT>-1,"+","")][h:lNgT=lNgT+bNgT+" - Navigator's Tools (Int)"]
[h:bPsK=json.get(AtrMods, "Wisdom")+floor(Proficiency*if(json.get(LClass,"LBrd")>1,if(PsK==0,1/2,PsK),PsK))][h:lPsK=if(bPsK>-1,"+","")][h:lPsK=lPsK+bPsK+" - Poisoner's Kit (Wis)"]
[h:bTvT=json.get(AtrMods, "Dexterity")+max(TvT*Proficiency,if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))][h:lTvT=if(bTvT>-1,"+","")][h:lTvT=lTvT+bTvT+" - Thieves' Tools (Dex)"]

[h:AddedBonus=0]
[h:sBonus="0"]
[h:SkillDesc=""]
[h:iSkills=-1]
[h:mBonusStr=""]
[h:mBonus=0]
[h:mBonusOriginal=0]
[h:mAdv=""]
[h:mDis=""]
[h:mMessage=""]

[h,if(ForcedSkill==""),CODE:{

[h:listSkills="--Choose--,"+lAcb+","+lAnH+","+lArc+","+lAth+","+lDcp+","+lHst+","+lIns+","+lImd+","+lInv+","+lMed+","+lNtr+","+lPcp+","+lPfm+","+lPrs+","+lRlg+","+lSoH+","+lStl+","+lSrv+","+lArT+","+lDsk+","+lFgk+","+lGmS+","+lHbK+","+lMsI+","+lNgT+","+lPsK+","+lTvT+","+lStr+","+lDex+","+lCon+","+lInt+","+lWis+","+lCha]

[h:SkillCheck=input(
	"SkillDesc|--Description Here--|Description||WIDTH=40",
	"iSkills|"+listSkills+"|Skills|LIST",
	"Alternate|-NO-,Str,Dex,Con,Int,Wis,Cha|Use Alternate Ability|LIST|VALUE=STRING",
	"sBonus||Bonus||WIDTH=20",
	"dmOnly|0|Only show DM?|CHECK"
)]
[h:abort(SkillCheck)]
[h:AddedBonus=eval(sBonus+"+1d1-1")]

};{
	[h:Alternate="-NO-"]
	[h:dmOnly=0]
	[h:iSkills=if(ForcedSkill=="Acrobatics",0,iSkills)]
	[h:iSkills=if(ForcedSkill=="Animal Handling",1,iSkills)]
	[h:iSkills=if(ForcedSkill=="Arcana",2,iSkills)]
	[h:iSkills=if(ForcedSkill=="Athletics",3,iSkills)]
	[h:iSkills=if(ForcedSkill=="Deception",4,iSkills)]
	[h:iSkills=if(ForcedSkill=="History",5,iSkills)]
	[h:iSkills=if(ForcedSkill=="Insight",6,iSkills)]
	[h:iSkills=if(ForcedSkill=="Intimidation",7,iSkills)]
	[h:iSkills=if(ForcedSkill=="Investigation",8,iSkills)]
	[h:iSkills=if(ForcedSkill=="Medicine",9,iSkills)]
	[h:iSkills=if(ForcedSkill=="Nature",10,iSkills)]
	[h:iSkills=if(ForcedSkill=="Perception",11,iSkills)]
	[h:iSkills=if(ForcedSkill=="Performance",12,iSkills)]
	[h:iSkills=if(ForcedSkill=="Persuasion",13,iSkills)]
	[h:iSkills=if(ForcedSkill=="Religion",14,iSkills)]
	[h:iSkills=if(ForcedSkill=="Sleight of Hand",15,iSkills)]
	[h:iSkills=if(ForcedSkill=="Stealth",16,iSkills)]
	[h:iSkills=if(ForcedSkill=="Survival",17,iSkills)]
	[h:iSkills=if(ForcedSkill=="Artisan's Tools",18,iSkills)]
	[h:iSkills=if(ForcedSkill=="Disguise Kit",19,iSkills)]
	[h:iSkills=if(ForcedSkill=="Forgery Kit",20,iSkills)]
	[h:iSkills=if(ForcedSkill=="Gaming Set",21,iSkills)]
	[h:iSkills=if(ForcedSkill=="Herbalism Kit",22,iSkills)]
	[h:iSkills=if(ForcedSkill=="Musical Instrument",23,iSkills)]
	[h:iSkills=if(ForcedSkill=="Navigator's Tools",24,iSkills)]
	[h:iSkills=if(ForcedSkill=="Poisoner's Kit",25,iSkills)]
	[h:iSkills=if(ForcedSkill=="Thieves' Tools",26,iSkills)]
	[h:iSkills=if(ForcedSkill=="Strength",27,iSkills)]
	[h:iSkills=if(ForcedSkill=="Dexterity",28,iSkills)]
	[h:iSkills=if(ForcedSkill=="Constitution",29,iSkills)]
	[h:iSkills=if(ForcedSkill=="Intelligence",30,iSkills)]
	[h:iSkills=if(ForcedSkill=="Wisdom",31,iSkills)]
	[h:iSkills=if(ForcedSkill=="Charisma",32,iSkills)]
	[h:iSkills=iSkills+1]
}]

<!-- Note: I dont think alternate numerical bonuses calculate correctly with magic items but i cant be bothered to fix it right now. when i am bothered to fix it subtract the original magic bonus from skillbonus and add the new one -->
[h,switch(Alternate),code:
	case "-NO-": {[h:mBonusAlternateStr=""][h:mBonusAlternate=0][h:mAdvAlternate=""][h:mDisAlternate=""][h:mMessageAlternate=""]};
	case "Str": {[h:mBonusAlternateStr=mStrBonusStr][h:mBonusAlternate=mStrBonus][h:mAdvAlternate=mStrAdv][h:mDisAlternate=mStrDis][h:mMessageAlternate=mStrMessage]};
	case "Dex": {[h:mBonusAlternateStr=mDexBonusStr][h:mBonusAlternate=mDexBonus][h:mAdvAlternate=mDexAdv][h:mDisAlternate=mDexDis][h:mMessageAlternate=mDexMessage]};
	case "Con": {[h:mBonusAlternateStr=mConBonusStr][h:mBonusAlternate=mConBonus][h:mAdvAlternate=mConAdv][h:mDisAlternate=mConDis][h:mMessageAlternate=mConMessage]};
	case "Int": {[h:mBonusAlternateStr=mIntBonusStr][h:mBonusAlternate=mIntBonus][h:mAdvAlternate=mIntAdv][h:mDisAlternate=mIntDis][h:mMessageAlternate=mIntMessage]};
	case "Wis": {[h:mBonusAlternateStr=mWisBonusStr][h:mBonusAlternate=mWisBonus][h:mAdvAlternate=mWisAdv][h:mDisAlternate=mWisDis][h:mMessageAlternate=mWisMessage]};
	case "Cha": {[h:mBonusAlternateStr=mChaBonusStr][h:mBonusAlternate=mChaBonus][h:mAdvAlternate=mChaAdv][h:mDisAlternate=mChaDis][h:mMessageAlternate=mChaMessage]}]

[h,switch(iSkills),code:
	case 0: {[SkillTitle="-No Skill Selected"]};
	case 1: {[SkillTitle=lAcb][mAdv=mAcbAdv+if(Alternate=="-NO-",mDexAdv,mAdvAlternate)][mDis=mAcbDis+if(Alternate=="-NO-",mDexDis,mDisAlternate)][mMessage=mAcbMessage+if(Alternate=="-NO-",mDexMessage,mMessageAlternate)][mBonusOriginal=mDexBonus][mBonusStr=mAcbBonusStr+if(Alternate=="-NO-",mDexBonusStr,mBonusAlternateStr)][mBonus=mAcbBonus+if(Alternate=="-NO-",mDexBonus,mBonusAlternate)][SkillBonus=bAcb+if(Alternate=="-NO-",0,if(and(Acb==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 2: {[SkillTitle=lAnH][mAdv=mAnHAdv+if(Alternate=="-NO-",mWisAdv,mAdvAlternate)][mDis=mAnHDis+if(Alternate=="-NO-",mWisDis,mDisAlternate)][mMessage=mAnHMessage+if(Alternate=="-NO-",mWisMessage,mMessageAlternate)][mBonusOriginal=mWisBonus][mBonusStr=mAnHBonusStr+if(Alternate=="-NO-",mWisBonusStr,mBonusAlternateStr)][mBonus=mAnHBonus+if(Alternate=="-NO-",mWisBonus,mBonusAlternate)][SkillBonus=bAnH+if(Alternate=="-NO-",0,if(and(AnH==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	case 3: {[SkillTitle=lArc][mAdv=mArcAdv+if(Alternate=="-NO-",mIntAdv,mAdvAlternate)][mDis=mArcDis+if(Alternate=="-NO-",mIntDis,mDisAlternate)][mMessage=mArcMessage+if(Alternate=="-NO-",mIntMessage,mMessageAlternate)][mBonusOriginal=mIntBonus][mBonusStr=mArcBonusStr+if(Alternate=="-NO-",mIntBonusStr,mBonusAlternateStr)][mBonus=mArcBonus+if(Alternate=="-NO-",mIntBonus,mBonusAlternate)][SkillBonus=bArc+if(Alternate=="-NO-",0,if(and(Arc==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 4: {[SkillTitle=lAth][mAdv=mAthAdv+if(Alternate=="-NO-",mStrAdv,mAdvAlternate)][mDis=mAthDis+if(Alternate=="-NO-",mStrDis,mDisAlternate)][mMessage=mAthMessage+if(Alternate=="-NO-",mStrMessage,mMessageAlternate)][mBonusOriginal=mStrBonus][mBonusStr=mAthBonusStr+if(Alternate=="-NO-",mStrBonusStr,mBonusAlternateStr)][mBonus=mAthBonus+if(Alternate=="-NO-",mStrBonus,mBonusAlternate)][SkillBonus=bAth+if(Alternate=="-NO-",0,if(and(Ath==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Strength")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Strength")))]};
	case 5: {[SkillTitle=lDcp][mAdv=mDcpAdv+if(Alternate=="-NO-",mChaAdv,mAdvAlternate)][mDis=mDcpDis+if(Alternate=="-NO-",mChaDis,mDisAlternate)][mMessage=mDcpMessage+if(Alternate=="-NO-",mChaMessage,mMessageAlternate)][mBonusOriginal=mChaBonus][mBonusStr=mDcpBonusStr+if(Alternate=="-NO-",mChaBonusStr,mBonusAlternateStr)][mBonus=mDcpBonus+if(Alternate=="-NO-",mChaBonus,mBonusAlternate)][SkillBonus=bDcp+if(Alternate=="-NO-",0,if(and(Dcp==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Charisma")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Charisma")))]};
	case 6: {[SkillTitle=lHst][mAdv=mHstAdv+if(Alternate=="-NO-",mIntAdv,mAdvAlternate)][mDis=mHstDis+if(Alternate=="-NO-",mIntDis,mDisAlternate)][mMessage=mHstMessage+if(Alternate=="-NO-",mIntMessage,mMessageAlternate)][mBonusOriginal=mIntBonus][mBonusStr=mHstBonusStr+if(Alternate=="-NO-",mIntBonusStr,mBonusAlternateStr)][mBonus=mHstBonus+if(Alternate=="-NO-",mIntBonus,mBonusAlternate)][SkillBonus=bHst+if(Alternate=="-NO-",0,if(and(Hst==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 7: {[SkillTitle=lIns][mAdv=mInsAdv+if(Alternate=="-NO-",mWisAdv,mAdvAlternate)][mDis=mInsDis+if(Alternate=="-NO-",mWisDis,mDisAlternate)][mMessage=mInsMessage+if(Alternate=="-NO-",mWisMessage,mMessageAlternate)][mBonusOriginal=mWisBonus][mBonusStr=mInsBonusStr+if(Alternate=="-NO-",mWisBonusStr,mBonusAlternateStr)][mBonus=mInsBonus+if(Alternate=="-NO-",mWisBonus,mBonusAlternate)][SkillBonus=bIns+if(Alternate=="-NO-",0,if(and(Ins==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	case 8: {[SkillTitle=lImd][mAdv=mImdAdv+if(Alternate=="-NO-",mChaAdv,mAdvAlternate)][mDis=mImdDis+if(Alternate=="-NO-",mChaDis,mDisAlternate)][mMessage=mImdMessage+if(Alternate=="-NO-",mChaMessage,mMessageAlternate)][mBonusOriginal=mChaBonus][mBonusStr=mImdBonusStr+if(Alternate=="-NO-",mChaBonusStr,mBonusAlternateStr)][mBonus=mImdBonus+if(Alternate=="-NO-",mChaBonus,mBonusAlternate)][SkillBonus=bImd+if(Alternate=="-NO-",0,if(and(Imd==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Charisma")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Charisma")))]};
	case 9: {[SkillTitle=lInv][mAdv=mInvAdv+if(Alternate=="-NO-",mIntAdv,mAdvAlternate)][mDis=mInvDis+if(Alternate=="-NO-",mIntDis,mDisAlternate)][mMessage=mInvMessage+if(Alternate=="-NO-",mIntMessage,mMessageAlternate)][mBonusOriginal=mIntBonus][mBonusStr=mInvBonusStr+if(Alternate=="-NO-",mIntBonusStr,mBonusAlternateStr)][mBonus=mInvBonus+if(Alternate=="-NO-",mIntBonus,mBonusAlternate)][SkillBonus=bInv+if(Alternate=="-NO-",0,if(and(Inv==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 10: {[SkillTitle=lMed][mAdv=mMedAdv+if(Alternate=="-NO-",mWisAdv,mAdvAlternate)][mDis=mMedDis+if(Alternate=="-NO-",mWisDis,mDisAlternate)][mMessage=mMedMessage+if(Alternate=="-NO-",mWisMessage,mMessageAlternate)][mBonusOriginal=mWisBonus][mBonusStr=mMedBonusStr+if(Alternate=="-NO-",mWisBonusStr,mBonusAlternateStr)][mBonus=mMedBonus+if(Alternate=="-NO-",mWisBonus,mBonusAlternate)][SkillBonus=bMed+if(Alternate=="-NO-",0,if(and(Med==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	case 11: {[SkillTitle=lNtr][mAdv=mNtrAdv+if(Alternate=="-NO-",mIntAdv,mAdvAlternate)][mDis=mNtrDis+if(Alternate=="-NO-",mIntDis,mDisAlternate)][mMessage=mNtrMessage+if(Alternate=="-NO-",mIntMessage,mMessageAlternate)][mBonusOriginal=mIntBonus][mBonusStr=mNtrBonusStr+if(Alternate=="-NO-",mIntBonusStr,mBonusAlternateStr)][mBonus=mNtrBonus+if(Alternate=="-NO-",mIntBonus,mBonusAlternate)][SkillBonus=bNtr+if(Alternate=="-NO-",0,if(and(Ntr==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 12: {[SkillTitle=lPcp][mAdv=mPcpAdv+if(Alternate=="-NO-",mWisAdv,mAdvAlternate)][mDis=mPcpDis+if(Alternate=="-NO-",mWisDis,mDisAlternate)][mMessage=mPcpMessage+if(Alternate=="-NO-",mWisMessage,mMessageAlternate)][mBonusOriginal=mWisBonus][mBonusStr=mPcpBonusStr+if(Alternate=="-NO-",mWisBonusStr,mBonusAlternateStr)][mBonus=mPcpBonus+if(Alternate=="-NO-",mWisBonus,mBonusAlternate)][SkillBonus=bPcp+if(Alternate=="-NO-",0,if(and(Pcp==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	case 13: {[SkillTitle=lPfm][mAdv=mPfmAdv+if(Alternate=="-NO-",mChaAdv,mAdvAlternate)][mDis=mPfmDis+if(Alternate=="-NO-",mChaDis,mDisAlternate)][mMessage=mPfmMessage+if(Alternate=="-NO-",mChaMessage,mMessageAlternate)][mBonusOriginal=mChaBonus][mBonusStr=mPfmBonusStr+if(Alternate=="-NO-",mChaBonusStr,mBonusAlternateStr)][mBonus=mPfmBonus+if(Alternate=="-NO-",mChaBonus,mBonusAlternate)][SkillBonus=bPfm+if(Alternate=="-NO-",0,if(and(Pfm==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Charisma")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Charisma")))]};
	case 14: {[SkillTitle=lPrs][mAdv=mPrsAdv+if(Alternate=="-NO-",mChaAdv,mAdvAlternate)][mDis=mPrsDis+if(Alternate=="-NO-",mChaDis,mDisAlternate)][mMessage=mPrsMessage+if(Alternate=="-NO-",mChaMessage,mMessageAlternate)][mBonusOriginal=mChaBonus][mBonusStr=mPrsBonusStr+if(Alternate=="-NO-",mChaBonusStr,mBonusAlternateStr)][mBonus=mPrsBonus+if(Alternate=="-NO-",mChaBonus,mBonusAlternate)][SkillBonus=bPrs+if(Alternate=="-NO-",0,if(and(Prs==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Charisma")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Charisma")))]};
	case 15: {[SkillTitle=lRlg][mAdv=mRlgAdv+if(Alternate=="-NO-",mIntAdv,mAdvAlternate)][mDis=mRlgDis+if(Alternate=="-NO-",mIntDis,mDisAlternate)][mMessage=mRlgMessage+if(Alternate=="-NO-",mIntMessage,mMessageAlternate)][mBonusOriginal=mIntBonus][mBonusStr=mRlgBonusStr+if(Alternate=="-NO-",mIntBonusStr,mBonusAlternateStr)][mBonus=mRlgBonus+if(Alternate=="-NO-",mIntBonus,mBonusAlternate)][SkillBonus=bRlg+if(Alternate=="-NO-",0,if(and(Rlg==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 16: {[SkillTitle=lSoH][mAdv=mSoHAdv+if(Alternate=="-NO-",mDexAdv,mAdvAlternate)][mDis=mSoHDis+if(Alternate=="-NO-",mDexDis,mDisAlternate)][mMessage=mSoHMessage+if(Alternate=="-NO-",mDexMessage,mMessageAlternate)][mBonusOriginal=mDexBonus][mBonusStr=mSoHBonusStr+if(Alternate=="-NO-",mDexBonusStr,mBonusAlternateStr)][mBonus=mSoHBonus+if(Alternate=="-NO-",mDexBonus,mBonusAlternate)][SkillBonus=bSoH+if(Alternate=="-NO-",0,if(and(SoH==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 17: {[SkillTitle=lStl][mAdv=mStlAdv+if(Alternate=="-NO-",mDexAdv,mAdvAlternate)][mDis=mStlDis+if(Alternate=="-NO-",mDexDis,mDisAlternate)][mMessage=mStlMessage+if(Alternate=="-NO-",mDexMessage,mMessageAlternate)][mBonusOriginal=mDexBonus][mBonusStr=mStlBonusStr+if(Alternate=="-NO-",mDexBonusStr,mBonusAlternateStr)][mBonus=mStlBonus+if(Alternate=="-NO-",mDexBonus,mBonusAlternate)][SkillBonus=bStl+if(Alternate=="-NO-",0,if(and(Stl==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 18: {[SkillTitle=lSrv][mAdv=mSrvAdv+if(Alternate=="-NO-",mWisAdv,mAdvAlternate)][mDis=mSrvDis+if(Alternate=="-NO-",mWisDis,mDisAlternate)][mMessage=mSrvMessage+if(Alternate=="-NO-",mWisMessage,mMessageAlternate)][mBonusOriginal=mWisBonus][mBonusStr=mSrvBonusStr+if(Alternate=="-NO-",mWisBonusStr,mBonusAlternateStr)][mBonus=mSrvBonus+if(Alternate=="-NO-",mWisBonus,mBonusAlternate)][SkillBonus=bSrv+if(Alternate=="-NO-",0,if(and(Srv==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	
	case 19: {[SkillTitle=lArT][SkillBonus=bArT+if(Alternate=="-NO-",0,if(and(ArT==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 20: {[SkillTitle=lDsK][SkillBonus=bDsK+if(Alternate=="-NO-",0,if(and(DsK==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Charisma")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Charisma")))]};
	case 21: {[SkillTitle=lFgK][SkillBonus=bFgK+if(Alternate=="-NO-",0,if(and(FgK==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 22: {[SkillTitle=lGmS][SkillBonus=bGmS+if(Alternate=="-NO-",0,if(and(GmS==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 23: {[SkillTitle=lHbK][SkillBonus=bHbK+if(Alternate=="-NO-",0,if(and(HbK==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	case 24: {[SkillTitle=lMsI][SkillBonus=bMsI+if(Alternate=="-NO-",0,if(and(MsI==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Charisma")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Charisma")))]};
	case 25: {[SkillTitle=lNgT][SkillBonus=bNgT+if(Alternate=="-NO-",0,if(and(NgT==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 26: {[SkillTitle=lPsK][SkillBonus=bPsK+if(Alternate=="-NO-",0,if(and(PsK==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	case 27: {[SkillTitle=lTvT][SkillBonus=bTvT+if(Alternate=="-NO-",0,if(and(TvT==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	
	case 28: {[SkillTitle=lStr][mAdv=mStrAdv][mDis=mStrDis][mMessage=mStrMessage][mBonusOriginal=mStrBonus][mBonusStr=mStrBonusStr][mBonus=mStrBonus][SkillBonus=bStr+max(if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))]};
	case 29: {[SkillTitle=lDex][mAdv=mDexAdv][mDis=mDexDis][mMessage=mDexMessage][mBonusOriginal=mDexBonus][mBonusStr=mDexBonusStr][mBonus=mDexBonus][SkillBonus=bDex+max(if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))]};
	case 30: {[SkillTitle=lCon][mAdv=mConAdv][mDis=mConDis][mMessage=mConMessage][mBonusOriginal=mConBonus][mBonusStr=mConBonusStr][mBonus=mConBonus][SkillBonus=bCon+max(if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1),ceiling(1/2*Proficiency),0),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0))]};
	case 31: {[SkillTitle=lInt][mAdv=mIntAdv][mDis=mIntDis][mMessage=mIntMessage][mBonusOriginal=mIntBonus][mBonusStr=mIntBonusStr][mBonus=mIntBonus][SkillBonus=bInt+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0)]};
	case 32: {[SkillTitle=lWis][mAdv=mWisAdv][mDis=mWisDis][mMessage=mWisMessage][mBonusOriginal=mWisBonus][mBonusStr=mWisBonusStr][mBonus=mWisBonus][SkillBonus=bWis+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0)]};
	case 33: {[SkillTitle=lCha][mAdv=mChaAdv][mDis=mChaDis][mMessage=mChaMessage][mBonusOriginal=mChaBonus][mBonusStr=mChaBonusStr][mBonus=mChaBonus][SkillBonus=bCha+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0)]}
]

[h:ReliableResult=10+SkillBonus+AddedBonus]

[h:DisplayNum = indexOf(SkillTitle,"-")]
[h:dSkillTitle = substring(SkillTitle,DisplayNum+2)]

[h:ClassFeatureData = json.set("",
	"Flavor",if(or(SkillDesc=="",SkillDesc=="--Description Here--"),Flavor,SkillDesc),
	"ParentToken",json.get(macro.args,"ParentToken"),
	"DMOnly",json.get(macro.args,"DMOnly"),
	"BorderColorOverride",if(json.get(macro.args,"BorderColorOverride")=="","#2222AA",json.get(macro.args,"BorderColorOverride")),
	"TitleFontColorOverride",if(json.get(macro.args,"TitleFontColorOverride")=="","#FFFFFF",json.get(macro.args,"TitleFontColorOverride")),
	"AccentBackgroundOverride",json.get(macro.args,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(macro.args,"AccentTextOverride"),
	"TitleFont",json.get(macro.args,"TitleFont"),
	"BodyFont",json.get(macro.args,"BodyFont"),
	"Class","",
	"Name",dSkillTitle,
	"FalseName","",
	"OnlyRules",0
	)]

[r:pm.MacroFormat(ClassFeatureData)]

[h:AccentFormat = json.get(macro.return,"AccentFormat")]
[h:VerticalFormat = json.get(macro.return,"VerticalFormat")]
[h:VerticalFormatLinks = json.get(macro.return,"VerticalFormatLinks")]
[h:TableFormat = json.get(macro.return,"TableFormat")]
[h:outputTest.NoFullMacro = json.get(macro.return,"NoFullMacro")]
[h:outputTest.NoRolls = json.get(macro.return,"NoRolls")]
[h:outputTest.NoRules = json.get(macro.return,"NoRules")]
[h:DamageColor=pm.DamageColor()]
[h:HealingColor=pm.HealingColor()]
[h:CritColor=pm.CritColor()]
[h:CritFailColor=pm.CritFailColor()]
[h:LinkColor=pm.LinkColor()]

		[if(dmOnly==1), code:{
			<span style='font-size:1.5em;'>Skill Check: <b><span style='{if(roll1>=20,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[g:roll1+SkillBonus+AddedBonus]</span></b></span><i>HIDDEN</i><br>
			(Adv: <b><span style='{if(Max(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[g:Max(roll1,roll2)+SkillBonus+AddedBonus+if(Alternate=="-NO-",0,(mBonus-mBonusOriginal))]</span></b></span><i>HIDDEN</i> / Dis: <b><span style='{if(Min(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[g:Min(roll1,roll2)+SkillBonus+AddedBonus+if(Alternate=="-NO-",0,(mBonus-mBonusOriginal))]</span></b></span><i>HIDDEN</i>)
		};{
			<span style='font-size:1.5em;'>Skill Check: <span style='font-size:1em;'>[r:roll1+if((SkillBonus-mBonus)>0," + "," - ")+abs(SkillBonus-mBonus)+mBonusStr]</span> = <b><span style='{if(roll1>=20,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[r:roll1+SkillBonus+AddedBonus]</span></b></span><br>
			(Adv: <b><span style='{if(Max(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Max(roll1,roll2)+SkillBonus+AddedBonus+if(Alternate=="-NO-",0,(mBonus-mBonusOriginal))]</span></b> / Dis: <b><span style='{if(Min(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Min(roll1,roll2)+SkillBonus+AddedBonus+if(Alternate=="-NO-",0,(mBonus-mBonusOriginal))]</span></b>)
		}]

		[r:if(Alternate=="-NO-","","<br>Skill check rolled as a ")][r:if(Alternate=="-NO-","",Alternate)][r:if(Alternate=="-NO-",""," Check.")]

		[r:if(or(sBonus=="",sBonus==0),"","<br><b>Additional Bonus Included:</b> ")][r:if(or(sBonus=="",sBonus==0),"",sBonus)]
		<table>

<!--Change guidance and its removal to macrolink to remove and roll it, and change the message here to something like click this link if you want to roll your guidance-->
			[r:if(getState("Guidance"),"<tr><td><b>Guidance:</b> Add 1d4 to your check:<span style='font-size:1.5em;'> "+1d4+"</span></td></tr>","")]
			[h:setState("Guidance",0)]
			
			[r:if(json.get(LClass,"LBrb")>1,if(and(getState("Rage")==1,SkillTitle==lAth),"<tr><td>&#8226;</td><td> <b>Rage:</b> Advantage on <b>Strength Checks</b>.</td></tr>",""),"")]
			[r:if(getState("Blinded"),"<tr><td><b>Blinded:</b> You automatically fail any ability check that requires sight.</td></tr>","")]
			[r:if(getState("Deafened"),"<tr><td><b>Deafened:</b> You automatically fail any ability check that requires hearing.</td></tr>","")]
			[r:if(getState("Poisoned"),"<tr><td><b>Poisoned:</b> You have disadvantage on all ability checks.</td></tr>","")]
			[r:if(getState("Frightened"),"<tr><td><b>Frightened:</b> You have disadvantage on all ability checks while the source of your fear is within line of sight.</td></tr>","")]
			[r:if(Exhaustion>=1,"<tr><td><b>Exhausted:</b> You have disadvantage on all ability checks.</td></tr>","")]
			[r:if(getState("Foresight"),"<tr><td><b>Foresight:</b> You have advantage on all ability checks.</td></tr>","")]
			[r:if(and(getState("Enlarge"),or(SkillTitle==lAth,Alternate=="Str")),"<tr><td><b>Enlarge:</b> You have advantage on your check.</td></tr>","")]
			[r:if(and(getState("Reduce"),or(SkillTitle==lAth,Alternate=="Str")),"<tr><td><b>Reduce:</b> You have disadvantage on your check.</td></tr>","")]
			
			[r:if(and(json.get(LClass,"LBrb")>17,SkillTitle==lAth),"<tr><td>&#8226;</td><td> <b>Indomitable Might:</b> If <b>Str Check</b> result is less than <b>Strength:</b> "+json.get(Attributes,"Strength")+", use "+json.get(Attributes,"Strength")+" as the result instead.</td></tr>","")]
			[r:if(and(json.get(TotemSpirit,"Bear2")==1,SkillTitle==lAth),"<tr><td>&#8226;</td><td> <b>Aspect of the Bear:</b> Advantage on Str checks to push, pull, lift, or break objects.</td></tr>","")]
			[r:if(and(json.get(TotemSpirit,"Eagle2")==1,SkillTitle==lPcp),"<tr><td>&#8226;</td><td> <b>Aspect of the Eagle:</b> Dim light doesn't impose disadvantage on your Wisdom (Perception) checks.</td></tr>","")]
			[r:if(json.get(FtrArchetype,"Chmp")==1,if(and(json.get(LClass,"LFtr")>=7,SkillTitle==lAth),"<tr><td>&#8226;</td><td> <b>Remarkable Athlete:</b> When you make a running long jump, the distance you cover increases by "+json.get(AtrMods, "Strength")+" feet.</td></tr>",""),"")]
			[r:if(or(FavoredEnemy=="",SkillTitle!=lSrv),"","<tr><td>&#8226;</td><td> <b>Favored Enemy:</b> Advantage on Wisdom (Survival) checks to track "+FavoredEnemy+".</td></tr>")]
			[r:if(or(FavoredEnemy=="",and(SkillTitle!=lInv,SkillTitle!=lHst,SkillTitle!=lNtr)),"","<tr><td>&#8226;</td><td> <b>Favored Enemy:</b> Advantage on Intelligence checks to recall information about "+FavoredEnemy+".</td></tr>")]
			[r:if(or(NaturalExplorer=="",and(or(SkillTitle!=lSrv,Srv==0),or(SkillTitle!=lNtr,Ntr==0),or(SkillTitle!=lPcp,Pcp==0),or(SkillTitle!=lInv,Inv==0),or(SkillTitle!=lHst,Hst==0),or(SkillTitle!=lAnH,AnH==0))),"","<tr><td>&#8226;</td><td> <b>Natural Explorer:</b> Proficiency Bonus (<b>"+Proficiency+"</b>) is doubled for skills you are proficient in for Intelligence and Wisdom checks related to "+NaturalExplorer+".</td></tr>")]
			[r:if(json.get(LClass,"LRog")>=11,"<tr><td>&#8226;</td><td> <b>Reliable Talent:</b> If you are proficient in this skill, You can use <b>"+ReliableResult+"</b> instead of your lower rolled result.</b> </td></tr>","")]
			[r:if(and(json.get(RogArchetype,"Thif")==1,or(SkillTitle==lAth,SkillTitle==lAcb)),"<tr><td>&#8226;</td><td> <b>Second-Story Work:</b> When you make a running jump, the distance you cover increases by "+json.get(AtrMods, "Dexterity")+" feet.</td></tr>","")]
			[r:if(json.get(RogArchetype,"Thif")==1,if(and(json.get(LClass,"LRog")>=9,SkillTitle==lStl),"<tr><td>&#8226;</td><td> <b>Supreme Sneak:</b> You have advantage on <b>Dexterity (Stealth)</b> checks if you move no more than half your speed on the same turn.</td></tr>",""),"")]
			[r:if(and(json.get(LClass,"LArt")>=6,SkillTitle==lArT),"<tr><td>&#8226;</td><td> <b>Tool Expertise:</b> Your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool. </td></tr>","")]

			[r:if(and(or(Race=="Hill Dwarf",Race=="Mountain Dwarf"),SkillTitle==lHst),"<tr><td>&#8226;</td><td> <b>Stonecutting:</b> You are considered proficient and add double your proficiency bonus ("+(2*Proficiency)+" total) to Intelligence (History) checks to identify the origin of stonework.</td></tr>","")]
			[r:if(and(Race=="Wood Elf",SkillTitle==lStl),"<tr><td>&#8226;</td><td> <b>Mask of the Wild:</b> You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.</td></tr>","")]
			[r:if(and(Race=="Drow",SkillTitle==lPcp),"<tr><td>&#8226;</td><td> <b>Sunlight Sensitivity:</b> You have disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.</td></tr>","")]
			[r:if(and(Race=="Lightfoot Halfling",SkillTitle==lStl),"<tr><td>&#8226;</td><td> <b>Naturally Stealthy:</b> You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.</td></tr>","")]
			[r:if(and(or(Race=="Lightfoot Halfling",Race=="Stout Halfling"),or(roll1==1,roll2==1)),"<tr><td>&#8226;</td><td> <b>Halfling Luck</b>: You can reroll the 1 on your ability check, and must use the new roll.</td></tr>","")]
			[r:if(and(Race=="Rock Gnome",SkillTitle==lHst),"<tr><td>&#8226;</td><td> <b>Artificer's Lore:</b> You are considered proficient and add double your proficiency bonus ("+(2*Proficiency)+" total) to Intelligence (History) checks related to magical items, alchemical objects, or technological devices.</td></tr>","")]
			[r:if(and(Race=="Minotaur",SkillTitle==lAth),"<tr><td><&#8226;</td><td> <b>Horns:</b> Your horns grant advantage on all checks made to shove a creature.","")]

			[r:if(and(json.get(Feats,"Actor")==1,or(SkillTitle==lDcp,SkillTitle==lPfm)),"<tr><td>&#8226;</td><td> <b>Actor:</b> Advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person.</td></tr>","")]
			[r:if(and(json.get(Feats,"DungeonDelver")==1,or(SkillTitle==lPcp,SkillTitle==lInv)),"<tr><td>&#8226;</td><td> <b>Dungeon Delver:</b> Advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect the presence of secret doors.</td></tr><tr><td>&#8226;</td><td> You can search for traps while traveling at a normal pace.","")]
			[r:if(and(json.get(Feats,"Skulker")==1,SkillTitle==lPcp),"<tr><td>&#8226;</td><td> <b>Skulker:</b> Dim light doesn't impose disadvantage on your Wisdom (Perception) checks relying on sight.</td></tr>","")]
			[r:if(and(json.get(Feats,"MediumArmorMaster")==1,SkillTitle==lStl),"<tr><td>&#8226;</td><td> <b>Medium Armor Master:</b> Wearing Medium Armor doesn't impose disadvantage on your Dexterity (Stealth) checks.</td></tr>","")]
			[r:if(and(SkillTitle==lArT,ArT==1),"<tr><td>&#8226;</td><td><b>Artisan's Tool Proficiency:</b> Your proficiency bonus only applies when you are using:<br>"+if(json.get(ArtisansTools,"Alch")==1,"Alchemist's Supplies<br>","")+if(json.get(ArtisansTools,"Brew")==1,"Brewer's Supplies<br>","")+if(json.get(ArtisansTools,"Callig")==1,"Calligrapher's Supplies<br>","")+if(json.get(ArtisansTools,"Carp")==1,"Carpenter's Tools<br>","")+if(json.get(ArtisansTools,"Cartog")==1,"Cartographer's Tools<br>","")+if(json.get(ArtisansTools,"Cobb")==1,"Cobbler's Tools<br>","")+if(json.get(ArtisansTools,"Cook")==1,"Cooks's Utensils<br>","")+if(json.get(ArtisansTools,"Glass")==1,"Glassblower's Tools<br>","")+if(json.get(ArtisansTools,"Jewel")==1,"Jeweler's Tools<br>","")+if(json.get(ArtisansTools,"Leather")==1,"Leatherworker's Tools<br>","")+if(json.get(ArtisansTools,"Mason")==1,"Mason's Tools<br>","")+if(json.get(ArtisansTools,"Paint")==1,"Painter's Supplies<br>","")+if(json.get(ArtisansTools,"Potter")==1,"Potter's Tools<br>","")+if(json.get(ArtisansTools,"Smith")==1,"Smith's Tools<br>","")+if(json.get(ArtisansTools,"Tink")==1,"Tinker's Tools<br>","")+if(json.get(ArtisansTools,"Weav")==1,"Weaver's Tools<br>","")+if(json.get(ArtisansTools,"Wood")==1,"Woodcarver's Tools<br>","")+"If these tools do not apply, subtract "+Proficiency+" from your roll.</td></tr>","")]
			[r:if(and(SkillTitle==lMsI,MsI==1),"<b>Musical Instrument Proficiency:</b> Your proficiency bonus only applies when you are playing:<br>"+if(json.get(Instruments,"Bagp")==1,"Bagpipes<br>","")+if(json.get(Instruments,"Drum")==1,"Drums<br>","")+if(json.get(Instruments,"Dulc")==1,"Dulcimer<br>","")+if(json.get(Instruments,"Flut")==1,"Flute<br>","")+if(json.get(Instruments,"Lute")==1,"Lute<br>","")+if(json.get(Instruments,"Lyre")==1,"Lyre<br>","")+if(json.get(Instruments,"Horn")==1,"Horn<br>","")+if(json.get(Instruments,"PanF")==1,"Pan Flute<br>","")+if(json.get(Instruments,"Shawm")==1,"Shawm<br>","")+if(json.get(Instruments,"Viol")==1,"Viol<br>",""),"")]
			[r:if(and(Background=="Fisher",SkillTitle==lSrv),"<tr><td>&#8226;</td><td> <b>Harvest the Water:</b> Advantage on ability checks using fishing tackle.</td></tr>","")]
			[r:if(and(Background=="Sage",or(SkillTitle==lArc,SkillTitle==lHst,SkillTitle==lRlg)),"<tr><td>&#8226;</td><td> <b>Researcher:</b> If you do not know a piece of lore, you <i><b>often</i></b> know where and from whom you can obtain it. Usually, this information comes from a library, university, sage, or other learned person or creature. Sometimes, the knowledge may be unaccessible or cannot be found.</td></tr>","")]
			[r:if(or(json.get(json.get(Armor,json.get(Armor,0)),"StealthDis")==0,SkillTitle!=lStl),"","<tr><td>&#8226;</td><td> Your loud ass armor clanking around gives you disadvantage on stealth checks.</td></tr>")]
			
			[r,foreach(item,mAdv):"<tr><td>&#8226;</td><td> <b>"+item+":</b> Your "+item+" grants you advantage on this check.</td></tr>"]
			[r,foreach(item,mDis):"<tr><td>&#8226;</td><td> <b>"+item+":</b> Your "+item+" inflicts disadvantage on this check.</td></tr>"]
			[r,foreach(item,mMessage,"","##"):""+item+""]
		</table>
	</div>
</div>