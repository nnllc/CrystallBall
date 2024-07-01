Content.makeFrontInterface(900, 600);

//VU METER
const var LevelMeterL = Content.getComponent("LevelMeterL");
const var LevelMeterR = Content.getComponent("LevelMeterR");
const var CrystallBallknb = Content.getComponent("CrystallBallknb");

const var LevelMeterLock = Content.getComponent("LevelMeterLock");

const var VUGain = Synth.getEffect("VUGain");

//Decay Rate
const var DECAY_RATE = 0.93;

//Current Values
var curLevelL = 0.0;
var curLevelR = 0.0;

//Timer Callback
const var t1 = Engine.createTimerObject();
t1.setTimerCallback(function()
{
//Synth Values
  var LevelL = VUGain.getCurrentLevel(1);  
  var LevelR = VUGain.getCurrentLevel(0);
  
//Peak Synth Values  
  var peakLevelL = Math.max(LevelL, LevelL);  
  var peakLevelR = Math.max(LevelR, LevelR);
  
  
//Kick Left  
//-----------------------------------------------------------------------------  
    {
    if (peakLevelL > curLevelL)
      {
        curLevelL = peakLevelL;
      }
    else
      {
        curLevelL *= DECAY_RATE;
      }
    }
    
//Kick Right  
//-----------------------------------------------------------------------------     
    {
    if (peakLevelR > curLevelR)
      {
        curLevelR = peakLevelR;
      }
    else
      {
        curLevelR *= DECAY_RATE;
      }
    }
    

  
//Decibel Conversion  
//-----------------------------------------------------------------------------   
  LevelL = Engine.getDecibelsForGainFactor(curLevelL);  
  LevelR = Engine.getDecibelsForGainFactor(curLevelR);
  
  
//Set Values  
//-------------------------------------------------------------------------------  
  LevelMeterL.setValue(LevelL);  
  LevelMeterR.setValue(LevelR);
  CrystallBallknb.setValue(LevelL); 
  CrystallBallknb.setValue(LevelR);
  
});

t1.startTimer(30);

//
//TOOLTIP PANEL
namespace Tooltip
{
	const pnlTooltip = Content.getComponent("pnlTooltip");
	
	pnlTooltip.setPaintRoutine(function(g)
	
	{
		var tt = Content.getCurrentTooltip();
		
		g.setColour(this.get("textColour"));
		g.setFont("Arial", 14.0);
		g.drawAlignedText(tt, [0, 0, this.getWidth(), this.getHeight()], "left");

		
	});
	
	pnlTooltip.setTimerCallback(function()
	
	{
		this.repaint();
	});
	
	pnlTooltip.startTimer(100);
}

//PRESET BROWSER

//////////////// BEGINING OF THE PRESET BROSER WINDOW //////////////////////////


const var PRESET_Bar = Content.addPanel("PRESET_Bar", 482, 554);

Content.setPropertiesFromJSON("PRESET_Bar", {
    "width": 230,
    "height": 50,
    "itemColour": 00000000,
    "itemColour2": 00000000,
    "textColour": "00000000",
    "borderSize": 0,
    "visible": true,
    "borderRadius": 0,
});

namespace UserPresetWidgets
{
	/** Creates a arrow button that cycles through the current category. */
	inline function createPresetButton(name, x, y, up)
	{
		local widget = Content.addPanel(name, x, y);
    
		Content.setPropertiesFromJSON(name, {
		"width": 0,
		"height": 0,
		});
    
		widget.data.up = up;
    
		widget.setPaintRoutine(function(g)
		{
			g.setColour(this.data.hover ? 0x00000000 : 0x00000000);
			g.fillTriangle([0, 0, this.getWidth(), this.getHeight()], this.data.up ? Math.PI/2 : 1.5 * Math.PI);
		});
		return widget;
	};

	/** Creates a Label that shows the current User Preset.
	*
	*	You can click on it and it will open up a popup with the preset browser.
	*
	*	Customization: Use the itemColour property of the Panel to set the
	*	Preset Browser Colour.
	*/
	inline function createPresetDisplay(name, x, y)
	{
		local widget = Content.addPanel(name, x, y);
    
		Content.setPropertiesFromJSON(name, {
		"x": 1,
		"y": 10,
		"width": 223,
		"height": 30,
        "parentComponent": "PRESET_Bar",
		});
    
    
		widget.setPaintRoutine(function(g)
		{
			g.fillAll(this.data.hover ? 0x00000000 : 0x00000000);
			g.setColour(0x00000000);
			g.drawRect([0, 0, this.getWidth(), this.getHeight()], 1);
			g.setFont("Arial", 16.0);
			g.setColour(0xFF5c7aff);
    	
			g.drawAlignedText(Engine.getCurrentUserPresetName(), [10, 0, this.getWidth(), this.getHeight()], "left");
		});
    
		widget.setTimerCallback(function()
		{
			this.repaint();
		});
    
		widget.startTimer(300);
	
    
		widget.setMouseCallback(function(event)
		{
			this.data.hover = event.hover;
			this.repaint();
		});
		return widget;
	};

}

//Engine.loadNextUserPreset(true);
//const var UpButton = UserPresetWidgets.createPresetButton("UpButton", 0, 0, true);
//const var DownButton = UserPresetWidgets.createPresetButton("DownButton", 121, 13, false);
const var PresetDisplay = UserPresetWidgets.createPresetDisplay("PresetDisplay", 129, 0);

//Load Previous Preset
inline function onPrevPresetbtnControl(component, value)
{
	if(value)
	{
	Engine.loadPreviousUserPreset(true);
	}
};

Content.getComponent("PrevPresetbtn").setControlCallback(onPrevPresetbtnControl);

//Load Next Preset
inline function onNextPresetbtnControl(component, value)
{
	if(value)
	{
		Engine.loadNextUserPreset(true);
	}
	
};

Content.getComponent("NextPresetbtn").setControlCallback(onNextPresetbtnControl);

//ResetButton
const var PresetResetbtn = Content.getComponent("PresetResetbtn");

const var InputSigknb = Content.getComponent("InputSigknb");
const var OutputSigknb = Content.getComponent("OutputSigknb");

inline function onPresetResetbtnControl(component, value)
{
	MainShaperknb.setValue(0);
	MainShaperknb.changed();
	
	MainWarmknb.setValue(0);
	MainWarmknb.changed();
	
	MainChorusknb.setValue(0);
	MainChorusknb.changed();
	
	MainDetuneknb.setValue(0);
	MainDetuneknb.changed();
	
	MainAutopanknb.setValue(0);
	MainAutopanknb.changed();
	
	MainDelayknb.setValue(0);
	MainDelayknb.changed();
	
	MainReverbknb.setValue(0);
	MainReverbknb.changed();
	
	MainDimensionknb.setValue(0);
	MainDimensionknb.changed();
	
	MainAirknb.setValue(0);
	MainAirknb.changed();
	
	MainDropsknb.setValue(0);
	MainDropsknb.changed();
	
	HiPassknb.setValue(20);
	HiPassknb.changed();
	
	LoPassknb.setValue(20000);
	LoPassknb.changed();
	
	SideFXAutopanTimeknb.setValue(9);
	SideFXAutopanTimeknb.changed();
	
	SideFXDelayTimeknb.setValue(9);
	SideFXDelayTimeknb.changed();
	
	SideFXAirHPknb.setValue(20);
	SideFXAirHPknb.changed();
	
	SideFXAirLPknb.setValue(20000);
	SideFXAirLPknb.changed();
	
	SideFXDropsTimeknb.setValue(9);
	SideFXDropsTimeknb.changed();
	
	InputSigknb.setValue(0);
	InputSigknb.changed();
	
	OutputSigknb.setValue(0);
	OutputSigknb.changed();
	
};

Content.getComponent("PresetResetbtn").setControlCallback(onPresetResetbtnControl);

//Preset Popup - MIDI Popup
const var Presetbtn = Content.getComponent("Presetbtn");
const var MIDICCbtn = Content.getComponent("MIDICCbtn");

const var PresetPanel = Content.getComponent("PresetPanel");
const var MIDICCPanel = Content.getComponent("MIDICCPanel");

inline function onPresetbtnControl(component, value)
{
	if (value)
	{
	PresetPanel.showControl(value);
	MIDICCPanel.showControl(!value);
	MIDICCbtn.setValue(!value);
	}
	
	else
	{
	PresetPanel.showControl(value);
	}
};

Content.getComponent("Presetbtn").setControlCallback(onPresetbtnControl);

inline function onMIDICCbtnControl(component, value)
{
	if (value)
	{
	PresetPanel.showControl(!value);
	MIDICCPanel.showControl(value);
	Presetbtn.setValue(!value);
	}
	
	else
	{
	MIDICCPanel.showControl(value);
	}
};

Content.getComponent("MIDICCbtn").setControlCallback(onMIDICCbtnControl);

//Help/Manual Button
inline function onWebHelpbtnControl(component, value)
{
	if (value)
	{
	Engine.openWebsite("https://nnaud.io");
	}
};

Content.getComponent("WebHelpbtn").setControlCallback(onWebHelpbtnControl);

//Website Button
inline function onWebHomebtnControl(component, value)
{
	if (value)
	{
	Engine.openWebsite("https://nnaud.io");
	}
};

Content.getComponent("WebHomebtn").setControlCallback(onWebHomebtnControl);

////EFFECTS
//FILTER
////Hi-Pass
const var HiPassknb = Content.getComponent("HiPassknb");
const var HPMainknb = Content.getComponent("HPMainknb");
const var HPMainPowerbtn = Content.getComponent("HPMainPowerbtn");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onHiPassknbControl(component, value)
{
	if (value)
	{	
	HPMainPowerbtn.setValue(value);
	HPMainPowerbtn.changed();
	
	HPMainknb.setValue(value);
	HPMainknb.changed();
	}	
	
	if (value <= 20)
	{
	HPMainPowerbtn.setValue(!value);
	HPMainPowerbtn.changed();
	}
};
Content.getComponent("HiPassknb").setControlCallback(onHiPassknbControl); 

////Lo-Pass
const var LoPassknb = Content.getComponent("LoPassknb");
const var LPMainknb = Content.getComponent("LPMainknb");
const var LPMainPowerbtn = Content.getComponent("LPMainPowerbtn");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onLoPassknbControl(component, value)
{
	if (value)
	{	
	LPMainPowerbtn.setValue(value);
	LPMainPowerbtn.changed();
	
	LPMainknb.setValue(value);
	LPMainknb.changed();
	}	
	
	if (value >= 20000)
	{
	LPMainPowerbtn.setValue(!value);
	LPMainPowerbtn.changed();
	}
};
Content.getComponent("LoPassknb").setControlCallback(onLoPassknbControl); 

//SHAPER
const var MainShaperknb = Content.getComponent("MainShaperknb");
const var ShaperMonoknb = Content.getComponent("ShaperMonoknb");
const var ShaperHPknb = Content.getComponent("ShaperHPknb");

const var ShaperMonoPowerbtn = Content.getComponent("ShaperMonoPowerbtn");
const var ShaperHPPowerbtn = Content.getComponent("ShaperHPPowerbtn");

const var ShaperMono = Synth.getEffect("ShaperMono");
const var ShaperHP = Synth.getEffect("ShaperHP");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainShaperknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 100, 0);
	local v2 = normalisedToRange(value, 0, 250);
	
	ShaperMonoPowerbtn.setValue(value * 1000);
	ShaperHPPowerbtn.setValue(value * 1000);
	
	ShaperMonoknb.setValue(v1);
	ShaperHPknb.setValue(v2);
	
	ShaperMonoknb.changed();
	ShaperHPknb.changed();
	
	ShaperMonoPowerbtn.changed();
	ShaperHPPowerbtn.changed();
	}
	
};

Content.getComponent("MainShaperknb").setControlCallback(onMainShaperknbControl); 

//WARM
const var MainWarmknb = Content.getComponent("MainWarmknb");
const var WarmLowBoostknb = Content.getComponent("WarmLowBoostknb");
const var WarmSaturationAmtknb = Content.getComponent("WarmSaturationAmtknb");
const var WarmhiCutknb = Content.getComponent("WarmhiCutknb");
const var WarmMakeupknb = Content.getComponent("WarmMakeupknb");

const var WarmLowBoostPowerbtn = Content.getComponent("WarmLowBoostPowerbtn");
const var WarmSaturatorPowerbtn = Content.getComponent("WarmSaturatorPowerbtn");
const var WarmHiCutPowerbtn = Content.getComponent("WarmHiCutPowerbtn");

const var WarmLowBoost = Synth.getEffect("WarmLowBoost");
const var WarmSaturator = Synth.getEffect("WarmSaturator");
const var WarmHiCut = Synth.getEffect("WarmHiCut");
const var WarmMakeup = Synth.getEffect("WarmMakeup");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainWarmknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 0, 2);
	local v2 = normalisedToRange(value, 0, 0.8);
	local v3 = normalisedToRange(value, 20000, 8000);
	local v4 = normalisedToRange(value, 0, -13);
	
	WarmLowBoostPowerbtn.setValue(value * 1000);
	WarmSaturatorPowerbtn.setValue(value * 1000);
	WarmHiCutPowerbtn.setValue(value * 1000);
	
	WarmLowBoostknb.setValue(v1);
	WarmSaturationAmtknb.setValue(v2);
	WarmhiCutknb.setValue(v3);
	WarmMakeupknb.setValue(v4);
	
	WarmLowBoostknb.changed();
	WarmSaturationAmtknb.changed();
	WarmhiCutknb.changed();
	WarmMakeupknb.changed();
	
	WarmLowBoostPowerbtn.changed();
	WarmSaturatorPowerbtn.changed();
	WarmHiCutPowerbtn.changed();
	}
	
};

Content.getComponent("MainWarmknb").setControlCallback(onMainWarmknbControl); 

//DETUNE
const var MainDetuneknb = Content.getComponent("MainDetuneknb");
const var DetuneWidthknb = Content.getComponent("DetuneWidthknb");
const var DetuneTimeknb = Content.getComponent("DetuneTimeknb");
const var DetuneFBknb = Content.getComponent("DetuneFBknb");
const var DetuneDelayknb = Content.getComponent("DetuneDelayknb");


const var DetunePowerbtn = Content.getComponent("DetunePowerbtn");

const var Detune = Synth.getEffect("Detune");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainDetuneknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 0.0, 1);
	local v2 = normalisedToRange(value, 0, 1);
	local v3 = normalisedToRange(value, 0, 2);
	
	DetunePowerbtn.setValue(value * 1000);
	
	DetuneWidthknb.setValue(v1);
	DetuneFBknb.setValue(v2);
	DetuneTimeknb.setValue(v3);
	
	DetuneWidthknb.changed();
	DetuneFBknb.changed();
	DetuneTimeknb.changed();
	
	DetunePowerbtn.changed();
	}
	
};

Content.getComponent("MainDetuneknb").setControlCallback(onMainDetuneknbControl); 

//CHORUS
const var MainChorusknb = Content.getComponent("MainChorusknb");
const var ChorusRateknb = Content.getComponent("ChorusRateknb");
const var ChorusWidthknb = Content.getComponent("ChorusWidthknb");
const var ChorusFBknb = Content.getComponent("ChorusFBknb");
const var ChorusDelayknb = Content.getComponent("ChorusDelayknb");
const var ChorusVibratoknb = Content.getComponent("ChorusVibratoknb");

const var ChorusPowerbtn = Content.getComponent("ChorusPowerbtn");
const var ChorusVibratoPowerbtn = Content.getComponent("ChorusVibratoPowerbtn");

const var Chorus = Synth.getEffect("Chorus");
const var ChrousVibrato = Synth.getEffect("ChrousVibrato");
const var ChorusVibratoMOD = Synth.getTableProcessor("ChorusVibratoMOD");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainChorusknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 0, 0.85);
	local v2 = normalisedToRange(value, 0.5, 0.75);
	local v3 = normalisedToRange(value, 0, 0.5);
	local v4 = normalisedToRange(value, 0, 0.1);
	local v5 = normalisedToRange(value, 0, 0.4);
	
	ChorusPowerbtn.setValue(value * 1000);
	ChorusVibratoPowerbtn.setValue(value * 1000);
	
	ChorusRateknb.setValue(v1);
	ChorusWidthknb.setValue(v2);
	ChorusFBknb.setValue(v3);
	ChorusDelayknb.setValue(v4);
	ChorusVibratoknb.setValue(v5);
	
	ChorusRateknb.changed();
	ChorusWidthknb.changed();
	ChorusFBknb.changed();
	ChorusDelayknb.changed();
	ChorusVibratoknb.changed();
	
	ChorusPowerbtn.changed();
	ChorusVibratoPowerbtn.changed();
	}
	
};

Content.getComponent("MainChorusknb").setControlCallback(onMainChorusknbControl); 

//AUTOPAN
const var MainAutopanknb = Content.getComponent("MainAutopanknb");
const var SideFXAutopanTimeknb = Content.getComponent("SideFXAutopanTimeknb");
const var AutopanMixknb = Content.getComponent("AutopanMixknb");
const var AutopanTimeknb = Content.getComponent("AutopanTimeknb");

const var AutopanPowerbtn = Content.getComponent("AutopanPowerbtn");

const var Autopan = Synth.getEffect("Autopan");
const var AutopanMOD = Synth.getModulator("AutopanMOD");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainAutopanknbControl(component, value)
{
	if (value <= 1)
	{	
	local v1 = normalisedToRange(value, 0, 1);
	
	AutopanPowerbtn.setValue(value * 1000);
	
	AutopanMixknb.setValue(v1 * 100);
	AutopanMixknb.changed();
	
	AutopanPowerbtn.changed();
	}
	
};

Content.getComponent("MainAutopanknb").setControlCallback(onMainAutopanknbControl); 

inline function onSideFXAutopanTimeknbControl(component, value)
{
	AutopanTimeknb.setValue(value);
	AutopanTimeknb.changed();
};

Content.getComponent("SideFXAutopanTimeknb").setControlCallback(onSideFXAutopanTimeknbControl);

//DELAY
const var MainDelayknb = Content.getComponent("MainDelayknb");
const var SideFXDelayTimeknb = Content.getComponent("SideFXDelayTimeknb");
const var DelayTimeLeftknb = Content.getComponent("DelayTimeLeftknb");
const var DelayTimeRightknb = Content.getComponent("DelayTimeRightknb");
const var DelayMixknb = Content.getComponent("DelayMixknb");
const var DelayFBLeftknb = Content.getComponent("DelayFBLeftknb");
const var DelayFBRightknb = Content.getComponent("DelayFBRightknb");
const var DelayMakeupknb = Content.getComponent("DelayMakeupknb");

const var DelayPowerbtn = Content.getComponent("DelayPowerbtn");

const var Delay = Synth.getEffect("Delay");
const var DelayMakeup = Synth.getEffect("DelayMakeup");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainDelayknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 1, 1);
	local v2 = normalisedToRange(value, 0, 0.5);
	local v3 = normalisedToRange(value, -30, -9);
	
	DelayPowerbtn.setValue(value * 1000);
	
	DelayMixknb.setValue(v1);
	DelayFBLeftknb.setValue(v2);
	DelayFBRightknb.setValue(v2);
	DelayMakeupknb.setValue(v3);
	
	DelayMixknb.changed();
	DelayFBLeftknb.changed();
	DelayFBRightknb.changed();
	DelayMakeupknb.changed();
	
	DelayPowerbtn.changed();
	}
	
};

Content.getComponent("MainDelayknb").setControlCallback(onMainDelayknbControl); 


inline function onSideFXDelayTimeknbControl(component, value)
{
	if (value)
	{
		DelayTimeLeftknb.setValue(value);
		DelayTimeRightknb.setValue(value);
		
		DelayTimeLeftknb.changed();
		DelayTimeRightknb.changed();
	}
};

Content.getComponent("SideFXDelayTimeknb").setControlCallback(onSideFXDelayTimeknbControl);

//REVERB
const var MainReverbknb = Content.getComponent("MainReverbknb");
const var ReverbMixknb = Content.getComponent("ReverbMixknb");
const var ReverbDampknb = Content.getComponent("ReverbDampknb");
const var ReverbWidthknb = Content.getComponent("ReverbWidthknb");
const var ReverbRoomknb = Content.getComponent("ReverbRoomknb");
const var ReverbHPknb = Content.getComponent("ReverbHPknb");
const var ReverbMakeupknb = Content.getComponent("ReverbMakeupknb");

const var ReverbPowerbtn = Content.getComponent("ReverbPowerbtn");
const var ReverbHPbtn = Content.getComponent("ReverbHPbtn");

const var Reverb = Synth.getEffect("Reverb");
const var ReverbHP = Synth.getEffect("ReverbHP");
const var ReverbMakeup = Synth.getEffect("ReverbMakeup");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainReverbknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 1, 1);
	local v2 = normalisedToRange(value, 0, 0.5);
	local v3 = normalisedToRange(value, 0, 0.8);
	local v4 = normalisedToRange(value, 0, 0.95);
	local v5 = normalisedToRange(value, -30, -9);
	local v6 = normalisedToRange(value, 20, 325);
	
	ReverbPowerbtn.setValue(value * 1000);
	ReverbHPbtn.setValue(value * 1000);
	
	ReverbMixknb.setValue(v1);
	ReverbDampknb.setValue(v2);
	ReverbWidthknb.setValue(v3);
	ReverbRoomknb.setValue(v4);
	ReverbMakeupknb.setValue(v5);
	ReverbHPknb.setValue(v6);
	
	ReverbMixknb.changed();
	ReverbDampknb.changed();
	ReverbWidthknb.changed();
	ReverbRoomknb.changed();
	ReverbMakeupknb.changed();
	ReverbHPknb.changed();
	
	ReverbPowerbtn.changed();
	ReverbHPbtn.changed();
	}
	
};

Content.getComponent("MainReverbknb").setControlCallback(onMainReverbknbControl); 

//AIR
const var MainAirknb = Content.getComponent("MainAirknb");
const var SideFXAirHPknb = Content.getComponent("SideFXAirHPknb");
const var SideFXAirLPknb = Content.getComponent("SideFXAirLPknb");

const var AirDelayHPknb = Content.getComponent("AirDelayHPknb");
const var AirDelayLPknb = Content.getComponent("AirDelayLPknb");
const var AirDelayGritknb = Content.getComponent("AirDelayGritknb");
const var AirDelayGritMakupknb = Content.getComponent("AirDelayGritMakupknb");

const var AirReverbHPknb = Content.getComponent("AirReverbHPknb");
const var AirReverbLPknb = Content.getComponent("AirReverbLPknb");
const var AirReverbGritknb = Content.getComponent("AirReverbGritknb");
const var AirReverbGritMakeupknb = Content.getComponent("AirReverbGritMakeupknb");

const var AirDelayHPPowerbtn = Content.getComponent("AirDelayHPPowerbtn");
const var AirDelayLPPowerbtn = Content.getComponent("AirDelayLPPowerbtn");
const var AirReverbHPPowerbtn = Content.getComponent("AirReverbHPPowerbtn");
const var AirReverbLPPowerbtn = Content.getComponent("AirReverbLPPowerbtn");
const var AirDelayGritPowerbtn = Content.getComponent("AirDelayGritPowerbtn");
const var AirReverbGritPowerbtn = Content.getComponent("AirReverbGritPowerbtn");

const var AIRDelayHP = Synth.getEffect("AIRDelayHP");
const var AIRDelayLP = Synth.getEffect("AIRDelayLP");
const var AIRDelayGrit = Synth.getEffect("AIRDelayGrit");
const var AIRReverbHP = Synth.getEffect("AIRReverbHP");
const var AIRReverbLP = Synth.getEffect("AIRReverbLP");
const var AIRReverbGrit = Synth.getEffect("AIRReverbGrit");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainAirknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 0, 0.9);
	local v2 = normalisedToRange(value, 0, 0.9);
	local v3 = normalisedToRange(value, 0, -16);
	
	AirDelayGritPowerbtn.setValue(value * 1000);
	AirReverbGritPowerbtn.setValue(value * 1000);
	
	AirDelayGritknb.setValue(v1);
	AirReverbGritknb.setValue(v2);
	AirDelayGritMakupknb.setValue(v3);
	AirReverbGritMakeupknb.setValue(v3);

	AirDelayGritknb.changed();
	AirReverbGritknb.changed();
	AirDelayGritMakupknb.changed();
	AirReverbGritMakeupknb.changed();
	
	AirDelayGritPowerbtn.changed();
	AirReverbGritPowerbtn.changed();
	}
	
};

Content.getComponent("MainAirknb").setControlCallback(onMainAirknbControl); 

inline function onSideFXAirHPknbControl(component, value)
{
	if (value)
	{
		AirDelayHPknb.setValue(value);
		AirDelayHPknb.changed();
		
		AirReverbHPknb.setValue(value);
		AirReverbHPknb.changed();
	}
	
	if (value)
	{	
		AirDelayHPPowerbtn.setValue(value);
		AirDelayHPPowerbtn.changed();
	
		AirReverbHPPowerbtn.setValue(value);
		AirReverbHPPowerbtn.changed();
	}	
	
	if (value <= 20)
	{
		AirDelayHPPowerbtn.setValue(!value);
		AirDelayHPPowerbtn.changed();
	
		AirReverbHPPowerbtn.setValue(!value);
		AirReverbHPPowerbtn.changed();
	}
};

Content.getComponent("SideFXAirHPknb").setControlCallback(onSideFXAirHPknbControl);

inline function onSideFXAirLPknbControl(component, value)
{
	if (value)
	{
		AirDelayLPknb.setValue(value);
		AirDelayLPknb.changed();
		
		AirReverbLPknb.setValue(value);
		AirReverbLPknb.changed();
	}
	
	if (value)
	{	
		AirDelayLPPowerbtn.setValue(value);
		AirDelayLPPowerbtn.changed();
	
		AirReverbLPPowerbtn.setValue(value);
		AirReverbLPPowerbtn.changed();
	}	
	
	if (value >= 20000)
	{
		AirDelayLPPowerbtn.setValue(!value);
		AirDelayLPPowerbtn.changed();
	
		AirReverbLPPowerbtn.setValue(!value);
		AirReverbLPPowerbtn.changed();
	}
};

Content.getComponent("SideFXAirLPknb").setControlCallback(onSideFXAirLPknbControl);

//GATE-DROPS
const var MainDropsknb = Content.getComponent("MainDropsknb");
const var SideFXDropsTimeknb = Content.getComponent("SideFXDropsTimeknb");
const var GateDropsAmountknb = Content.getComponent("GateDropsAmountknb");
const var GateDropsTimeknb = Content.getComponent("GateDropsTimeknb");

const var GateDropsPowerbtn = Content.getComponent("GateDropsPowerbtn");

const var GateDrops = Synth.getEffect("GateDrops");
const var GateDropsMOD = Synth.getModulator("GateDropsMOD");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainDropsknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 0, 1);
	
	GateDropsPowerbtn.setValue(value * 1000);
	
	GateDropsAmountknb.setValue(v1);
	
	GateDropsAmountknb.changed();
	
	GateDropsPowerbtn.changed();
	}
	
};

Content.getComponent("MainDropsknb").setControlCallback(onMainDropsknbControl); 

inline function onSideFXDropsTimeknbControl(component, value)
{
	GateDropsTimeknb.setValue(value);
	GateDropsTimeknb.changed();
};

Content.getComponent("SideFXDropsTimeknb").setControlCallback(onSideFXDropsTimeknbControl);

//DIMENSION
const var MainDimensionknb = Content.getComponent("MainDimensionknb");
const var DimensionSlapTimeknb = Content.getComponent("DimensionSlapTimeknb");
const var DimensionSlapMixknb = Content.getComponent("DimensionSlapMixknb");
const var Dimension3dknb = Content.getComponent("Dimension3dknb");
const var DimensionGainknb = Content.getComponent("DimensionGainknb");

const var DimensionSlapPowerbtn = Content.getComponent("DimensionSlapPowerbtn");
const var Dimension3dPowerbtn = Content.getComponent("Dimension3dPowerbtn");

const var DimensionSlapDelay = Synth.getEffect("DimensionSlapDelay");
const var Dimesnion3D = Synth.getEffect("Dimesnion3D");
const var DimensionMakeup = Synth.getEffect("DimensionMakeup");

inline function normalisedToRange(normalisedValue, min, max)
{
    return min + normalisedValue * (max - min);
}

inline function onMainDimensionknbControl(component, value)
{
	if (value <= 1)
	{
	local v1 = normalisedToRange(value, 0, 10);
	local v2 = normalisedToRange(value, 0, 0.5);
	local v3 = normalisedToRange(value, 100, 200);
	local v4 = normalisedToRange(value, 0, -6);
	
	DimensionSlapPowerbtn.setValue(value * 1000);
	Dimension3dPowerbtn.setValue(value * 1000);
	
	DimensionSlapTimeknb.setValue(v1);
	DimensionSlapMixknb.setValue(v2);
	Dimension3dknb.setValue(v3);
	DimensionGainknb.setValue(v4);
	
	DimensionSlapTimeknb.changed();
	DimensionSlapMixknb.changed();
	Dimension3dknb.changed();
	DimensionGainknb.changed();
	
	DimensionSlapPowerbtn.changed();
	Dimension3dPowerbtn.changed();
	}
	
};

Content.getComponent("MainDimensionknb").setControlCallback(onMainDimensionknbControl); 

//RANDON/MAGIC BUTTON
const var MagicRandombtn = Content.getComponent("MagicRandombtn");

inline function onMagicRandombtnControl(component, value)
{
	if (value)
	{
	MainDetuneknb.setValueWithUndo(Math.random());
	MainDetuneknb.changed();
	
	MainAutopanknb.setValueWithUndo(Math.random());
	MainAutopanknb.changed();
	
	SideFXAutopanTimeknb.setValueWithUndo(Math.randInt(0, 18));
	SideFXAutopanTimeknb.changed();
	
	MainWarmknb.setValueWithUndo(Math.random());
	MainWarmknb.changed();
	
	MainShaperknb.setValueWithUndo(Math.random());
	MainShaperknb.changed();
	
	MainChorusknb.setValueWithUndo(Math.random());
	MainChorusknb.changed();
	
	MainDelayknb.setValueWithUndo(Math.random());
	MainDelayknb.changed();
	
	MainReverbknb.setValueWithUndo(Math.random());
	MainReverbknb.changed();
	
	MainDimensionknb.setValueWithUndo(Math.random());
	MainDimensionknb.changed();
	
	SideFXDelayTimeknb.setValueWithUndo(Math.randInt(0, 18));
	SideFXDelayTimeknb.changed();
	
	SideFXAirHPknb.setValueWithUndo(Math.randInt(0, 1000));
	SideFXAirHPknb.changed();
	
	SideFXAirLPknb.setValueWithUndo(Math.randInt(4000, 20000));
	SideFXAirLPknb.changed();
	
	MainAirknb.setValueWithUndo(Math.random());
	MainAirknb.changed();
	
	SideFXDropsTimeknb.setValueWithUndo(Math.randInt(0, 18));
	SideFXDropsTimeknb.changed();
	
	MainDropsknb.setValueWithUndo(Math.random());
	MainDropsknb.changed();
	
	HiPassknb.setValueWithUndo(Math.randInt(0, 1000));
	HiPassknb.changed();
	
	LoPassknb.setValueWithUndo(Math.randInt(4000, 20000));
	LoPassknb.changed();
	
	}
};

Content.getComponent("MagicRandombtn").setControlCallback(onMagicRandombtnControl);

//UNDO/REDO FUNCTION
const var Undobtn = Content.getComponent("Undobtn");
const var Redobtn = Content.getComponent("Redobtn");


inline function onUndobtnControl(component, value)
{
	if (value)
	{
	Engine.undo();
	}
};

Content.getComponent("Undobtn").setControlCallback(onUndobtnControl);


inline function onRedobtnControl(component, value)
{
	if (value)
	{
	Engine.redo();
	}
};

Content.getComponent("Redobtn").setControlCallback(onRedobtnControl);function onNoteOn()
{
	
}
 function onNoteOff()
{
	
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 