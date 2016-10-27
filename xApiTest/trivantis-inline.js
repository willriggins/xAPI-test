/**************************************************
Trivantis (http://www.trivantis.com)
**************************************************/

var ocmOrig = document.oncontextmenu
var ocmNone = new Function( "return false" )

// Inline Object
function ObjInline(n,a,x,y,w,h,v,z,c,d,s,fb, cl) {
  this.name = n
  this.altName = a
  this.x = x
  this.y = y
  this.w = w
  this.h = h
  this.v = v
  this.z = z
  this.s = s
  this.iType = '';
  this.isGrp = false
  this.hasOnUp = false
  this.hasOnRUp = false
  this.clip=0;
  if(c==-1 || c==-2){
    this.bgColor = null;
    this.clip=2;
  }else this.bgColor = c;
  this.obj = this.name+"Object"
  this.parmArray = new Array
  this.numParms = 0
  this.alreadyActioned = false;
  this.eatOnUp=false;
  this.eatOnRUp=false;
  eval(this.obj+"=this")
  if ( d != 'undefined' && d!=null )
    this.divTag = d;
  else  
    this.divTag = "div";
  this.childArray = new Array  
  this.isPlaying = false;
  this.hasDone   = 0;
  this.flsPlayer = null;
  this.autoPlay  = false;
  this.bAutoStart = false;
  this.hasBeenProcessed = false;
  this.bSizing = false;
  this.muteState = false;
  this.arrChoice = new Array
  this.addClasses = cl;
  this.arrEvents = new Array
  this.timerVar=null;
  this.YTPlayer = null;
  this.quOrd = null;
  this.bOffPage = false;
  this.bBottom = fb?true:false;
  this.opacity = 100;
}

function ObjInlineGetActualWidth()
{
	var width = this.w;
	if( width == -1 ){
		var obj = document.getElementById(this.name);
		if( obj ){
			width = obj.offsetWidth;
		}
	}
	
	return width;
}

function ObjInlineGetNS( tagName) { 
	var flashName = "swf" + this.name;
	if (navigator.appVersion.indexOf("Mac")!=-1) 
		return eval( "swf" + this.name );

	var obj = 0;
	try{ obj = eval( "window.document.embeds." + flashName ); }catch(e){};
	return obj;
}

function ObjInlineAddParm( newParm ) {
  this.parmArray[this.numParms++] = newParm;
}

function ObjInlineAddChild( newChild ) {
  this.childArray[this.childArray.length] = newChild;
}

function ObjInlineActionGoTo( destURL, destFrame ) {
  this.objLyr.actionGoTo( destURL, destFrame );
}

function ObjInlineActionGoToNewWindow( destURL, name, props ) {
  this.objLyr.actionGoToNewWindow( destURL, name, props );
}

function ObjInlineActionPlay( ) { 

  if(this.timerVar != null && typeof(this.timerVar) != "undefined" )
  {
	var timerCurrVal = this.timerVar.getValue();
	if( timerCurrVal != null && typeof(timerCurrVal) != "undefined" ) {
		timerCurrVal = timerCurrVal.toString();
		if( timerCurrVal.indexOf( 'pause:' ) != -1 )
		{
			timerCurrVal = parseInt( timerCurrVal.split(':')[1] );
			this.timerVar.set( (parseInt((new Date().getTime()+500)/1000)*1000) - timerCurrVal );
		}
	}
  }
  else if( this.iType == 'flashvid' ) 
  {
     if (is.useHTML5Video()){	
		var medobj = document.getElementById('html5' + this.name);
		if (medobj) {			
			medobj.play();
		}
		else {
			var thisObj = this;
			 setTimeout(function(){
				thisObj.actionPlay();
			 }, 100);
		}		
     }else{
		try{
			if (!this.flsPlayer) 
				this.setFlashPlayer();
							
			if (this.flsPlayer.PercentLoaded() != 100) 
				throw new Error('flash not loaded');
	
			if( !this.autoPlay )
			{
				if(this.flsPlayer.sendEvent)
				{
					this.flsPlayer.sendEvent('play');
					this.autoPlay = true;
				}
				else
				{
					var thisObj = this;
					setTimeout(function(){thisObj.actionPlay();}, 1000);
				}
			}
			
		}catch(err){   
			var thisObj = this;
			 setTimeout(function(){
				thisObj.actionPlay();
			 }, 1000);
		}
	 }
  }
  else if( this.iType == 'flash' ) 
  {
    if(! this.flsPlayer )
      this.setFlashPlayer()
  
    this.flsPlayer.Play();
    this.autoPlay = true;
    
  }
  else if( this.iType == 'wmp' ) 
  {
    eval("document."+this.name+"obj"+".controls.play()");
    this.isPlaying = true;
  }
  else if(this.iType == 'youtube')
  {
	 this.YTPlayer.playVideo() ;
  }
  else this.objLyr.actionPlay();
}

function ObjInlineActionStop( ) {

  if(this.timerVar != null )
  {
	this.timerVar.set( 'pause:0' );
  }else if( this.iType == 'flashvid' ) 
  {
     if (is.useHTML5Video())
     {
       var medobj = document.getElementById('html5' + this.name);
       if(medobj){ 
	      try{
		    medobj.pause();
            medobj.currentTime=0;
		  }catch(e){}
       }		
     }else{
     if(! this.flsPlayer )
        this.setFlashPlayer()

      this.flsPlayer.sendEvent('stop');
      this.autoPlay  = false;}
  }
  else if( this.iType == 'flash' ) 
  {
    if(! this.flsPlayer )
      this.setFlashPlayer()
  
    this.flsPlayer.GotoFrame(0);;
    this.flsPlayer.StopPlay();
    this.autoPlay  = false;
  }
  else if( this.iType == 'wmp' ) {
    eval("document."+this.name+"obj"+".controls.stop()");
    this.isPlaying = false;
  }
  else if(this.iType == 'youtube')
  {
	 this.YTPlayer.stopVideo() ;
  }
  else this.objLyr.actionStop();
}

function ObjInlineActionShow( ) {  
  if(IsMedia(this) && this.bAutoStart)
  {
	   this.actionPlay();
	   this.bAutoStart = false;  
  }
  
  if(IsAudioObj(this) && IsHiddenAudioObj(this))
  {
	this.actionShowAudio();
	return;
  }
	 

  if( this.isGrp || !this.isVisible() )
    this.onShow();
}

function ObjInlineActionHide( ) {
  if(IsMedia(this) && (this.isPlaying || this.autoPlay))
	  this.actionPause();
  
  if( IsAudioObj(this) && !IsHiddenAudioObj(this) ){
	this.actionHideAudio();
	
 
	return;
  }

  if( this.isGrp || this.isVisible() )
    this.onHide();
}

function ObjInlineActionShowAudio(){
	this.v = true;
	this.onShowAudio();
}

function ObjInlineActionHideAudio(){
	this.v = false;
	this.onHideAudio();
}

function ObjInlineActionLaunch( ) {
  this.objLyr.actionLaunch();
}

function ObjInlineActionExit( ) {
  this.objLyr.actionExit();
}

function ObjInlineActionChangeContents( value, align, fntId ) {
  var varValue = ''
  varValue += value
  if (arguments.length>1) {
    var div = null
    var fntName = this.objLyr.id + 'Font' + fntId
 
    if( varValue != "~~~null~~~" && varValue.split ) {
      var test = escape( varValue )
 
      test = test.replace(/%0A/g, '<br />'); // B15845
 		
      var ca = test.split('%5Cr')
      if( ca.length ) {
        var newVarValue=''
    
        for(var i=0;i<ca.length;i++) {
          newVarValue += ca[i]
          if( i < ca.length-1 ) 
            newVarValue += '<br />'
        }
        varValue = newVarValue
      }
      
      test = varValue;
      
      var ca = test.split('%')
      if( ca.length ) {
        var newVarValue=''
    
        for(var i=0;i<ca.length;i++) {
          var tempStr, holdStr;
          var uni = 0;
          if( i )
          {
            if( ca[i].charAt( 0 ) == 'u' )
            {
              uni = 1;
              holdStr = ca[i].substring( 5 );
            }
            else
              holdStr = ca[i].substring( 2 );
          }
          else
            holdStr = ca[i];
            
          if( i && i < ca.length ) 
          {
            if( uni )
              tempStr = ca[i].substring( 1, 5 )
            else
              tempStr = ca[i].substring( 0, 2 )

            var hexValue = parseInt( tempStr, 16 )

            if( hexValue == 32 )
              newVarValue += ' '
            else
              newVarValue += '&#' + hexValue + ';'

            newVarValue += holdStr
          }
          else
            newVarValue += holdStr
        }
        varValue = newVarValue
      }
    }
    
    var splitID = '<!--split=' + this.objLyr.id + 'ter' + '-->';
    var parts = this.objLyr.ele.innerHTML.split(splitID);
    if ( parts.length == 3 )
    {
      if( varValue == "~~~null~~~" ) div = parts[0] + splitID + '<' + this.divTag + ' class="' + align + '"><span class="' + fntName + '">' + '</span></' + this.divTag + '>'  + splitID + parts[2]; 
      else div =  parts[0] + splitID + '<' + this.divTag + ' class="' + align + '"><span class="' + fntName + '">' + varValue + '</span></' + this.divTag + '>' + splitID + parts[2]; 
    }
    if( !div )
    {
      if( varValue == "~~~null~~~" ) div = '<' + this.divTag + ' class="' + align + '"><span class="' + fntName + '">' + '</span></' + this.divTag + '>' 
      else div = '<' + this.divTag + ' class="' + align + '"><span class="' + fntName + '">' + varValue + '</span></' + this.divTag + '>'
    }
	
	if(this.heading > 0){
		var splitDiv = div.split("<span");
		
		div = splitDiv[0] + "<h" + this.heading + "><span" + splitDiv[1];
		
		splitDiv = div.split("</span>")
		
		div = splitDiv[0] + "</span></h" + this.heading + ">" + splitDiv[1];
	}
	
    if( is.ns5 ) this.objLyr.ele.innerHTML = div
    else this.objLyr.write( div );
  }
  else {
    if ( this.parmArray[1] ) {
      if( varValue.length == 0 )
      {
        var off = this.parmArray[1].indexOf( 'value=' )
        if( off >= 0 )
	  varValue = this.parmArray[1].substring( off + 7, this.parmArray[1].length-2 )

        //Fixup parm 0
        off = this.parmArray[0].indexOf( 'width=' )
        var front = this.parmArray[0].substring( 0, off + 7 )
        var end   = this.parmArray[0].substring( off + 7 )
        off = end.indexOf( "'" )
        var newString = front + this.w + end.substring( off )
        off = newString.indexOf( 'height=' )
        var front = newString.substring( 0, off + 8 )
        var end   = newString.substring( off + 8 )
        off = end.indexOf( "'" )
        this.parmArray[0] = front + this.h + end.substring( off )
      }

      if( this.iType == 'flashvid' ) {
        if( this.bSizing ) {
		  var strArr = new Array('width=', 'height=')
		  for(i=1; i < this.parmArray.length; i++) {
		    var delim = "&"
			for( y = 0 ; y < strArr.length; y++ ) {
			  var str = strArr[y];
			  var strLen = str.length
			  var off = this.parmArray[i].indexOf( str )
			  while(off > 0) {
			    var bIsNum = this.parmArray[i].charAt(off + strLen)
				if( bIsNum == "'" ) {
				  strLen++
				  delim = "'"
				}
				var front = this.parmArray[i].substring( 0, off + strLen )
				var end = this.parmArray[i].substring( off + strLen )
				var delimoff = end.indexOf( delim )
				this.parmArray[i] = front + (y==0?this.w:this.h) + end.substring( delimoff )
				off = this.parmArray[i].indexOf( str, off + strLen )
				strLen = str.length
				delim = "&"
			  }
			}
		  }
	      this.bSizing = false;
		}
		else {
            if(varValue.indexOf('media/') == 0 && (varValue.indexOf('.mp3') < 0 ))
                varValue = varValue.substring(6);
            var str = 'file=';
			for(i=1; i < this.parmArray.length; i++) {
				off = this.parmArray[i].indexOf( str )
				if( off > 0 ) {
					var front = this.parmArray[i].substring( 0, off + 5 )
					var end   = this.parmArray[i].substring( off + 5 )
					off = end.indexOf( "&" )
					this.parmArray[i] = front + varValue + end.substring( off )
				}
			}
			this.flsPlayer = null;
        }
        
      }else if(this.iType == 'wmp' ){
		this.parmArray[1] = "<param name='URL' value='" + varValue + "'>";
        this.parmArray[3] = "<embed src='" + varValue + "' width='" + this.w + "'   height='" + this.h + "'PLUGINSPAGE='http://microsoft.com/windows/mediaplayer/en/download/' type='application/x-mplayer2'  name='" + this.name + "'>";
	  }else{
        this.parmArray[1] = "<param name='movie' value='" + varValue + "'>";
	for(var i=0; i<this.parmArray.length; i++)
	{
		var currParm = this.parmArray[i];
		if( currParm.length > 6 && currParm.indexOf('<embed') == 0)
			this.parmArray[i] = "<embed src='" + varValue + "' width='" + this.w + "'   height='" + this.h + "' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' name='swf" + this.name + "' swliveconnect='true' "+(this.autoPlay?"autostart='true'":"")+">";
	}
      }
      this.build();
      var str = "";
      for (var i=0; i < this.numParms; i++) str = str + this.parmArray[i]
      if( is.ns5 ) this.objLyr.ele.innerHTML = str
      else this.objLyr.write( str );
	  this.flsPlayer = null;
    }
    else {
      if(this.iType == 'flashvid' && is.useHTML5Video()){
        if(value==''){
	  var off = this.parmArray[0].indexOf( 'width=' );
	  var front = this.parmArray[0].substring( 0, off + 7 );
	  off = this.parmArray[0].indexOf( "'", off + 7 );
	  var end = this.parmArray[0].substring( off )
	  this.parmArray[0] = front + this.w + end;
	  off = this.parmArray[0].indexOf( 'height=' );
	  front = this.parmArray[0].substring( 0, off + 8 );
	  off = this.parmArray[0].indexOf( "'", off + 8 );
	  var end = this.parmArray[0].substring( off )
	  this.parmArray[0] = front + this.h + end;
        }else{
	  var off = this.parmArray[0].indexOf( 'src=' );
	  var front = this.parmArray[0].substring( 0, off + 5 );
	  off = this.parmArray[0].indexOf( "'", off + 5 );
	  var end = this.parmArray[0].substring( off )
	  this.parmArray[0] = front + value + end;
        }
	this.build();
	this.objLyr.write( this.parmArray[0] );
      }
    }
  }
}

function ObjInlineActionTogglePlay( ) {
  if( this.timerVar!=null && typeof(this.timerVar)!="undefined" )
  {
	var timerCurrVal = this.timerVar.getValue();
	if( timerCurrVal != null && typeof(timerCurrVal) != "undefined" ) {
		timerCurrVal = timerCurrVal.toString();
		if( timerCurrVal.indexOf( 'pause:' ) != -1 )
			this.actionPlay();
		else
			this.actionPause();
	}
  }
  else if( this.iType == 'flashvid' ) 
  {
     if (is.useHTML5Video()){
     var medobj = document.getElementById('html5' + this.name);
     if(medobj){
     if(medobj.paused==true) medobj.play();
     else medobj.pause()}
     }else{
     if(! this.flsPlayer ) this.setFlashPlayer()
     if( this.autoPlay ) this.autoPlay = false;
	 else this.autoPlay = true;
     this.flsPlayer.sendEvent('play');}
  }
  else if( this.iType == 'flash' ) 
  {
      if(! this.flsPlayer )
      	this.setFlashPlayer()
  
      if( this.flsPlayer.IsPlaying() ) {
          this.flsPlayer.StopPlay();
          this.autoPlay  = false;
      }
      else {
	      this.flsPlayer.Play();
	      this.autoPlay = true;
      }
  }
  else if( this.iType == 'wmp' ) 
  {
	this.setPlayState();
    if( this.isPlaying ) {
	    eval("document."+this.name+"obj"+".controls.stop()");
	    this.isPlaying = false;
    }
    else {
	    eval("document."+this.name+"obj"+".controls.play()");
	    this.isPlaying = true;
    }
  }
  else if(this.iType == 'youtube')
  {
	if(this.YTPlayer.getPlayerState() == 1)
		this.YTPlayer.pauseVideo();
	else
		this.YTPlayer.playVideo();
  }
  else this.objLyr.actionTogglePlay();

}

function ObjInlineActionToggleShow( ) {
  if( this.isGrp ) {
    for ( var i=0; i<this.childArray.length; i++ )
       eval( this.childArray[i] + ".actionToggleShow()");
  }
  else if(this.objLyr.isVisible()){ 
    //echo LD-975: Audio objects are always visible. They are moved 10000px off page when hidden. 
	if( IsAudioObj(this) ){
		if( IsHiddenAudioObj(this) ){
			this.actionShow();
		}
		else this.actionHide();
	}
	else
		this.actionHide();
  }
  else 
    this.actionShow();
}

function ObjInlineSizeTo( w, h, bResp ) { 
    var tempObj = {xOffset:0, yOffset:0, width: w, height: h, xOuterOffset:0, yOuterOffset:0};
		
	AdjustAttributesForEffects(this, tempObj);
	
	AdjustIFrameSize(this, tempObj);
	
	var svgFilterTag = document.getElementById(this.name+"Shadow");
	
	if(svgFilterTag)
		ModifySVGShadow(this, tempObj);
		
    this.bSizing = true;
	this.build()
	if(this.objLyr)
	{
		this.activate()
		if(typeof(bResp) == "undefined")
			this.objLyr.clipTo( 0, tempObj.width, tempObj.height, 0  )
	}
    this.actionChangeContents( '' )
}

function ObjInlineGoToFrame( frame ) {
   if( this.iType == 'flash' ) 
   {
      if(! this.flsPlayer )
      	this.setFlashPlayer()
     
      this.flsPlayer.GotoFrame(frame);
   }

}

function ObjInlineGoToNextFrame() {
   if( this.iType == 'flash' ) 
   {
      if(! this.flsPlayer )
      	this.setFlashPlayer()
        
      var frame = this.flsPlayer.CurrentFrame()+1;
      this.flsPlayer.GotoFrame(frame);
   }

}

function ObjInlineGoToPrevFrame() {
  if( this.iType == 'flash' ) 
  {
      if(! this.flsPlayer )
      	this.setFlashPlayer()
          
      var frame = this.flsPlayer.CurrentFrame()-1;
      this.flsPlayer.GotoFrame(frame);
   }
}

function ObjInlineGoToLabel( label ) {
  if( this.iType == 'flash' ) 
  {
     if(! this.flsPlayer )
      	this.setFlashPlayer()
          
     this.flsPlayer.TGotoLabel('/', String(label) );
   }
}

function ObjInlineGetFlashVar ( varName ) {
     if(! this.flsPlayer )
      	this.setFlashPlayer()
          
     return this.flsPlayer.GetVariable( String(varName) );

	
}

function ObjInlineSetFlashVar( varName,myValue ) {
 if(! this.flsPlayer )
      	this.setFlashPlayer()

  this.flsPlayer.SetVariable( String(varName), String(myValue) );
}

function ObjInlinePause() {

  if( typeof this.timerVar != 'undefined' && this.timerVar != null )
  {
	var timerCurrVal = parseInt( this.timerVar.getValue() );
	if( timerCurrVal && timerCurrVal != "NaN" )
		this.timerVar.set( 'pause:' + ( (parseInt((new Date().getTime()+500)/1000)*1000) - timerCurrVal ) );
  }
  else if( this.iType == 'flashvid' ) 
  {
     if (is.useHTML5Video()){
     var medobj = document.getElementById('html5' + this.name);
     if(medobj) medobj.pause();
     }else{
     if(! this.flsPlayer )
        this.setFlashPlayer()
     if( this.autoPlay )
     {  
        this.flsPlayer.sendEvent('PLAY');
     }
	this.autoPlay = false;}
  }
  else if( this.iType == 'flash' ) 
  {
     if(! this.flsPlayer )
        this.setFlashPlayer()

      this.flsPlayer.StopPlay();
  }
  else if( this.iType == 'wmp' ) 
  {
	this.setPlayState();
	eval("document."+this.name+"obj"+".controls.pause()");
	this.isPlaying = false;
  }
  else if(this.iType == 'youtube')
  {
	this.YTPlayer.pauseVideo();
  }
}

function ObjInlineDone() {
  if( typeof this.timerVar != 'undefined' && this.timerVar != null )
  {
	var timerCurrVal = parseInt( this.timerVar.getValue() );
	if( timerCurrVal && timerCurrVal != "NaN" )
		this.timerVar.set( 'done:' + ( (parseInt((new Date().getTime()+500)/1000)*1000) - timerCurrVal ) );
  }
}

function ObjInlineActionMute() {
    if (this.iType == 'flashvid') 
	{
      if (is.useHTML5Video()){	
		var medobj = document.getElementById('html5' + this.name);
		if (medobj)			
			medobj.muted=true;
		}else{
        if (!this.flsPlayer) this.setFlashPlayer()

        this.flsPlayer.sendEvent('MUTE', 'true');
		}
        this.muteState = true;
    }
	else if(this.iType == 'youtube')
	{
		this.YTPlayer.mute();
	}
}

function ObjInlineActionUnmute() {
    if (this.iType == 'flashvid') 
	{
      if (is.useHTML5Video()){	
		var medobj = document.getElementById('html5' + this.name);
		if (medobj)			
			medobj.muted=false;
		}else{
        if (!this.flsPlayer) this.setFlashPlayer()

        this.flsPlayer.sendEvent('MUTE', 'false');
		}
        this.muteState = false;
    }
	else if(this.iType == 'youtube')
	{
		this.YTPlayer.unMute();
	}
}

{ // Setup prototypes
var p=ObjInline.prototype
p.addParm = ObjInlineAddParm
p.build = ObjInlineBuild
p.init = ObjInlineInit
p.activate = ObjInlineActivate
p.up = ObjInlineUp
p.down = ObjInlineDown
p.over = ObjInlineOver
p.out = ObjInlineOut
p.capture = 0
p.onOver = new Function()
p.onOut = new Function()
p.onSelect = new Function()
p.onDown = new Function()
p.onUp = new Function()
p.onRUp = new Function()
p.actionGoTo = ObjInlineActionGoTo
p.actionGoToNewWindow = ObjInlineActionGoToNewWindow
p.actionPlay = ObjInlineActionPlay
p.actionStop = ObjInlineActionStop
p.actionShow = ObjInlineActionShow
p.actionHide = ObjInlineActionHide
p.actionShowAudio = ObjInlineActionShowAudio
p.actionHideAudio = ObjInlineActionHideAudio
p.actionLaunch = ObjInlineActionLaunch
p.actionExit = ObjInlineActionExit
p.actionChangeContents = ObjInlineActionChangeContents
p.actionTogglePlay = ObjInlineActionTogglePlay
p.actionToggleShow = ObjInlineActionToggleShow
p.writeLayer = ObjInlineWriteLayer
p.onShow = ObjInlineOnShow
p.onHide = ObjInlineOnHide
p.onShowAudio = ObjInlineOnShowAudio
p.onHideAudio = ObjInlineOnHideAudio
p.isVisible = ObjInlineIsVisible
p.onSelChg = new Function()
p.addChild = ObjInlineAddChild
p.doTrans = ObjInlineDoTrans
p.sizeTo  = ObjInlineSizeTo
p.goToFrame     = ObjInlineGoToFrame
p.goToNextFrame = ObjInlineGoToNextFrame
p.goToPrevFrame = ObjInlineGoToPrevFrame
p.goToLabel     = ObjInlineGoToLabel
p.getFlashVar   = ObjInlineGetFlashVar
p.setFlashVar   = ObjInlineSetFlashVar
p.getAcualWidth = ObjInlineGetActualWidth
p.getNS         = ObjInlineGetNS
p.getFlashVars  = ObjInlineGetFlashVar
p.actionPause	= ObjInlinePause
p.actionDone	= ObjInlineDone
p.offset        = ObjInlineOffset
p.moveGrp       = ObjInlineMoveGrp
p.transGrp      = ObjInlineTransGrp
p.setPlayState  = ObjInlinefSetPlayState
p.onDone		= new Function() 
p.isDone        = ObjInlineIsDone
p.setFlashPlayer = ObjInlineSetFlashPlayer
p.displayDynText = ObjInlineDisplayDynText
p.actionMute = ObjInlineActionMute
p.actionUnmute = ObjInlineActionUnmute
p.disable = ObjInlineDisableChild
p.randomize = ObjInlineRandomize
p.addChoice = ObjInlineAddChoice
p.addEvent = ObjInlineAddEvent
p.loadProps = ObjLoadProps
p.respChanges = ObjRespChanges
p.addYouTubeParams = ObjInlineYouTubeParams
p.addYTScript = ObjInlineAddYouTubeAPI
p.createPlayer = ObjInlineCreatePlayer
p.stateChange = ObjInlinePlayerStateChange
p.setAutostart = ObjInlineaddAutoStart
p.reorgChoice = ObjInlineChoiceOrder
p.validateSrc = ObjInlineValidSource

p.initEvent = function()
{
	var THIS = this;
	
	if (is.useHTML5Video())
	{
		var html5VidObj = document.getElementById("html5" + THIS.name);
	
		html5VidObj.addEventListener("timeupdate", 
			function () 
			{
				for (var i=0; i < THIS.arrEvents.length; i++) 
				{
					if (!(THIS && html5VidObj))
						return;
					var trivEvent = THIS.arrEvents[i];
					if (!trivEvent.proc && 
						html5VidObj.currentTime >= trivEvent.time && 
						html5VidObj.currentTime <= html5VidObj.duration)
					{
						trivEvent.proc = true;
						window[trivEvent.func]();
					}
				}
				if (!(THIS && THIS.clearEventsFlag))
						return;
				THIS.clearEventsFlag(html5VidObj.currentTime)
			},	false);
			
		html5VidObj.addEventListener("ended", 
			function (){ THIS.clearEventsFlag(-1) },	false
		);
	}		
};

p.clearEventsFlag = function(pos) 
{
    for (var i = 0; i < this.arrEvents.length; i++) 
	{
		var ev = this.arrEvents[i];
        if (ev.proc && pos < ev.time)
            ev.proc = false;
    }
};

}

function ObjInlineBuild() {
  this.loadProps();
  
  var visible = this.v;
  var leftPos = this.x;
   
  //echo LD-975: Move the audio object WAY off of the page if it's initially hidden. Always keep the flash window visible. 
  //JB the audio can't be played in IE if it is not visible, and customers do this all the time.
  if( IsAudioObj(this) ){
	visible = true;
	
	if(IsHiddenAudioObj(this))
		leftPos = 10000;
  }
  
  var clipRect ='';
  if(this.clip == 2)
  {
	var adjW = this.w;
	var adjH = this.h;
	if(IsRSSFeed(this))
	{
		adjW+=2;
		adjH+=2;
	}		
	clipRect = 'clip: rect(0px ' + adjW + 'px ' + adjH + 'px 0px);';
  }
  else
	clipRect = 'noclip'; 

  if( this.bgColor || this.clip || this.iType)
    this.css = buildCSS(this.name,leftPos,this.y,this.w,this.h,visible,this.z,this.bgColor,clipRect)
  else
    this.css = buildCSS(this.name,leftPos,this.y,this.w,null,visible,this.z,this.bgColor)

	if(this.s == 1 && is.iOS)
	{
		var tempStr = this.css.substring(0, this.css.length-2);
		tempStr += '-webkit-overflow-scrolling: touch; overflow-y: scroll;';
		tempStr += '}\n';
		this.css = tempStr;
	}

  var divStart
  var divEnd
  divStart = '<' + this.divTag + ' id="'+this.name+'"'
  if( this.addClasses ) divStart += ' class="'+this.addClasses+'"'
  if( this.altName ) divStart += ' alt="'+this.altName+'"'
  else { if( this.altName != null ) divStart += ' alt=""' }
  divStart += '><a name="'+this.name+'anc"'
  if( this.hasOnUp ) divStart += ' href="javascript:' +this.name+ '.onUp()"'
  divStart += '>'
  divEnd   = '</a></' + this.divTag + '>'
  this.div = divStart + '\n' + divEnd + '\n'
}

function ObjInlineInit() {
  this.objLyr = new ObjLayer(this.name)
}

function ObjInlineActivate() {
  if( this.objLyr && this.objLyr.styObj && !this.alreadyActioned ) {
    if( this.isGrp ) {
      if( this.v ) {
        for ( var i=0; i<this.childArray.length; i++ )
        {
          if ( eval( this.childArray[i] + ".isVisible()") )
            eval( this.childArray[i] + ".actionShow()");
        }
      }
    }
    else{
      if( this.v ) this.actionShow();
	  
	  if( IsHiddenAudioObj(this) ) this.actionHideAudio();
	}
  }
  if( this.capture & 4 ) {
    this.objLyr.ele.onmousedown = new Function("event", this.obj+".down(event); return false;")
    this.objLyr.ele.onmouseup = new Function("event", this.obj+".up(event); return false;")
  }
  if( this.capture & 1 ) this.objLyr.ele.onmouseover = new Function(this.obj+".over(); return false;")
  if( this.capture & 2 ) this.objLyr.ele.onmouseout = new Function(this.obj+".out(); return false;")
  if( this.numParms ) {
    var str = "";
    for (var i=0; i < this.numParms; i++) str = str + this.parmArray[i]
    if( is.ns5 ) this.objLyr.ele.innerHTML = str
    else this.objLyr.write( str );
  }
  if(this.iType == 'flashvid'&&is.useHTML5Video()){
     var funcOnDone=0;
     try{funcOnDone=eval( this.name + 'onDone' );}catch(error){}
     var medobj = document.getElementById('html5' + this.name);
     if(medobj&&funcOnDone) medobj.addEventListener('ended', funcOnDone, false);
  }
  try {
    if( is.ie && is.v<=7 && this.objLyr.ele.getElementsByTagName )
    {
      var paraElems = this.objLyr.ele.getElementsByTagName("P");
	  for ( var idx=0; paraElems && idx<paraElems.length; idx++ )
	  {
		if (paraElems[idx] && paraElems[idx].legLH )
			paraElems[idx].style.lineHeight = paraElems[idx].legLH;
	  }	
    }
  } catch(err) {}
  
  if(this.iType =='youtube')
  {
	  if(is.YTScriptLoaded)
		  this.createPlayer();
	  else
	  {
		  var THIS = this;
		  setTimeout(function(){THIS.createPlayer();},500)
	  }
  }
  if(IsMedia(this) && this.v && this.bAutoStart)
	  this.actionPlay();
  
  this.objLyr.theObj = this;
}

function ObjInlineDown(e) {
  if( is.ie ) e = event
  if( is.ie && !is.ieMac && e.button!=1 && e.button!=2 ) return
  if( is.ieMac && e.button != 0 ) return
  if( is.ns && e.button!=0 && e.button!=2 ) return
  this.onSelect()
  this.onDown()
}

function ObjInlineUp(e) {
  if( is.ie ) e = event
  if( is.ie && !is.ieMac && e.button!=1 && e.button!=2 ) return
  if( is.ieMac && e.button!=0 ) return
  if( is.ns && !is.nsMac && e.button!=0 && e.button!=2 ) return
  if( e.button==2 )
  {
    if( this.hasOnRUp )
    {
      document.oncontextmenu = ocmNone
      this.onRUp()
      setTimeout( "document.oncontextmenu = ocmOrig", 100)
    }
  }
  else if( this.hasOnUp )
    this.onUp()
}

function ObjInlineOver() {
  this.onOver()
}

function ObjInlineOut() {
  this.onOut()
}

function ObjInlineWriteLayer( newContents ) {
  if (this.objLyr) this.objLyr.write( newContents )
}

function ObjInlineOnShow() {
  this.alreadyActioned = true;
  this.objLyr.actionShow();
  for ( var i=0; i<this.childArray.length; i++ )
  {
    if ( !eval( this.childArray[i] + ".isVisible()") )
      eval( this.childArray[i] + ".actionShow()");
  }
  
  if( this.matchObj )
	this.drawLine();
}

function ObjInlineOnHide() {
  this.alreadyActioned = true;
  for ( var i=0; i<this.childArray.length; i++ )
     eval( this.childArray[i] + ".actionHide()");
  this.objLyr.actionHide();

  if( this.matchLine )
	  this.matchLine.ResizeTo( -10, -10, -10, -10 );
  
  if( this.objLyr.doc.forms.length > 0 && this.objLyr.doc.forms[0].blur )
    this.objLyr.doc.forms[0].blur();
}

function ObjInlineOnShowAudio(){
  this.alreadyActioned = true;
  this.objLyr.actionShowAudio(this.x);
  for ( var i=0; i<this.childArray.length; i++ )
  {
    if ( !eval( this.childArray[i] + ".isVisible()") )
      eval( this.childArray[i] + ".actionShowAudio(" + this.x + ")");
  }
  
  if( this.matchObj )
	this.drawLine();
}

function ObjInlineOnHideAudio(){
  this.alreadyActioned = true;
  for ( var i=0; i<this.childArray.length; i++ )
     eval( this.childArray[i] + ".actionHideAudio()");
  this.objLyr.actionHideAudio();

  if( this.matchLine )
	  this.matchLine.ResizeTo( -10, -10, -10, -10 );
  
  if( this.objLyr.doc.forms.length > 0 && this.objLyr.doc.forms[0].blur )
    this.objLyr.doc.forms[0].blur();
}

function ObjInlineIsVisible() {

  //echo LD-975: Audio object DOM elements are always visible. The inline object is what keeps track of it's hidden state. 
  if(IsAudioObj(this) && IsHiddenAudioObj(this))
	return false;
	
  if( this.objLyr.isVisible() )
    return true;
  else
    return false;
}

function ObjInlineDoTrans(tOut,tNum,dur,fn,ol,ot,fl,ft,fr,fb,il) {
  if( !this.isVisible() )
  {
    for ( var i=0; i<this.childArray.length; i++ )
    {
      if ( !(eval( this.childArray[i] + ".isVisible()")) )
        eval( this.childArray[i] + ".actionShow()");
    }
  }
  this.objLyr.doTrans(tOut,tNum,dur,fn,ol,ot,fl,ft,fr,fb,il);
}

function ObjInlineOffset( off ) {
  var maxY = 0;
  for ( var i=0; i<this.childArray.length; i++ )
  {
     var obj = eval( this.childArray[i] )
     obj.objLyr.moveBy( null, off );
     var bottom = obj.objLyr.ele.offsetTop + obj.objLyr.ele.offsetHeight;
     if( maxY < bottom ) maxY = bottom;
  }
  
  return maxY;
}

function ObjInlineMoveGrp( x, y, objNameArr ) {
  if( !objNameArr)
    objNameArr = new Array();
  else
    objNameArr = eval(objNameArr);
    
  if( this.isGrp ) {
    for ( var i = 0; i < this.childArray.length; i++ ) {
      var obj = eval( this.childArray[i] )
      
      if (i == 0 ) {
        smallX = obj.x;
        smallY = obj.y;
      }
      
      // ** Get smallest x position
      if( smallX > obj.x )
      	smallX = obj.x;
      
      // ** Get smallest y position
      if( smallY > obj.y )
        smallY = obj.y;
    }
    
    var isLeft = false;
    var isUp   = false;
    
    var xVal = Math.abs(smallX - x);
    if( smallX > x ) isLeft = true;
    
    var yVal = Math.abs(smallY - y);
    if( smallY > y ) isUp = true;
    
    // ** move each obj
    for ( var i = 0; i < this.childArray.length; i++ ) {
      var currPosX = obj.x;
      var currPosY = obj.y
      var obj = eval( this.childArray[i] )
      if( isLeft ) currPosX = obj.x - xVal;
      else         currPosX = obj.x + xVal;
      
      if( isUp )   currPosY = obj.y - yVal;
      else         currPosY = obj.y + yVal;
      
      for ( var j = 0; j < objNameArr.length; j++ ) {
	      if( obj.name == objNameArr[j]) {
	      	var myObj = eval(objNameArr[j]);
	      	myObj.moveTo(currPosX,currPosY);
	      	myObj.hasMoved = true;
            myObj.newX = currPosX;
            myObj.newY = currPosY;
	  	  }
  	  }
      obj.objLyr.moveTo(currPosX,currPosY);
      obj.objLyr.hasMoved = true;
      obj.objLyr.newX = currPosX;
      obj.objLyr.newY = currPosY;
      
    }
  }
}

function ObjInlineTransGrp( tOut, tNum, dur, x, y, objNameArr ) {
  if( !objNameArr)
    objNameArr = new Array();
  else
    objNameArr = eval(objNameArr);
    
  if( this.isGrp ) {
    for ( var i = 0; i < this.childArray.length; i++ ) {
      var obj = eval( this.childArray[i] )
      
      if (i == 0 ) {
        smallX = obj.x;
        smallY = obj.y;
      }
      
      // ** Get smallest x position
      if( smallX > obj.x )
      	smallX = obj.x;
      
      // ** Get smallest y position
      if( smallY > obj.y )
        smallY = obj.y;
    }
    
    var isLeft = false;
    var isUp   = false;
    
    var xVal = Math.abs(smallX - x);
    if( smallX > x ) isLeft = true;
    
    var yVal = Math.abs(smallY - y);
    if( smallY > y ) isUp = true;
    
    // ** move each obj
    for ( var i = 0; i < this.childArray.length; i++ ) {
      var currPosX = obj.x;
      var currPosY = obj.y
      var obj = eval( this.childArray[i] )
      if( isLeft ) currPosX = obj.x - xVal;
      else         currPosX = obj.x + xVal;
      
      if( isUp )   currPosY = obj.y - yVal;
      else         currPosY = obj.y + yVal;
      
      for ( var j = 0; j < objNameArr.length; j++ ) {
	      if( obj.name == objNameArr[j]) {
	      	var myObj = eval(objNameArr[j]);
	      	myObj.doTrans(1,tNum,dur,null,myObj.x,myObj.y,currPosX,currPosY,0,0,0);
	      	myObj.hasMoved = true;
            myObj.newX = currPosX;
            myObj.newY = currPosY;
	  	  }
  	  }
      obj.objLyr.doTrans(tOut,tNum,dur,null,obj.objLyr.x,obj.objLyr.y,currPosX,currPosY,0,0,0);
      obj.objLyr.hasMoved = true;
      obj.objLyr.newX = currPosX;
      obj.objLyr.newY = currPosY;
      
    }
  }
}

function ObjInlinefSetPlayState() {
  var playerStatus = null;
  
  if (is.activeX)
    playerStatus = eval("document."+this.name+"obj"+".controls.playState");
  else
    playerStatus = eval("document."+this.name+"obj"+".controls.GetPlayState()");
  
  if( playerStatus ) {
      switch( playerStatus ) {
        case 0:
            // ** The playback state is undefined
        case 1:
            // ** Playback is stopped
        case 2:
            // ** Playback is paused
        case 6:
            // ** The player is buffering media
        case 7:
            // ** The player is waiting for streaming data
        case 8:
            // ** The player has reached the end of the media
        case 9:
            // ** The player is preparing new media
        case 10:
            // ** The player is ready to begin playback
            this.isPlaying = false;
            break;
        
        case 3:
            // ** The player is playing a stream
        case 4:
            // ** The player is scanning a stream forward
        case 5:
            // ** The player is scanning a stream in reverse
            this.isPlaying = true;
            break;
      }
  }
}

function ObjInlineIsDone()
{
	try
	{
		if(! this.flsPlayer )
		this.setFlashPlayer()

		if(this.flsPlayer){
			var currFrame = parseInt(this.flsPlayer.CurrentFrame())+1;
			var lastFrame;

			if( is.ie ) 
				lastFrame = parseInt(this.flsPlayer.TotalFrames);
			else       
				lastFrame = parseInt(this.flsPlayer.TotalFrames());

			if( currFrame >= lastFrame) {
				this.onDone()
				window.clearInterval(this.hasDone)
			}
		}
	}
	catch (e)
	{
	}
}

function ObjInlineSetFlashPlayer() {
    if( is.ie ) this.flsPlayer = eval( "document.swf" + this.name );
    else        this.flsPlayer = this.getNS("object");
}

function ObjInlineDisplayDynText( value, fntId ) {
    document.getElementById(this.objLyr.id).innerHTML = value;
}

function ObjInlineDisableChild(e) {
    for (var i = 0; i < this.childArray.length; i++) {
        var elem = document.getElementById(this.childArray[i] + "id");
        if (elem) elem.disabled = e;
		else
		{
			elem = document.getElementById(this.childArray[i]);
			if( elem ) elem.disabled = e;
		}
    }
}

function ObjInlineRandomize(bUseOrder) {
    var ctrlPlacement;
    var placementArr = new Array();
    var objBtnArr = new Array();
    var objTxtArr = new Array();
    var objImgArr = new Array();
    var dX = 0;
    var dY = 0;
    for (var i = 0; i < this.arrChoice.length; i++) {
        //if (i == 0) continue;
        var elem = document.getElementById(this.arrChoice[i].btn);
        if (elem) {
            if (this.arrChoice[i].btn.indexOf("check") != -1 || this.arrChoice[i].btn.indexOf("radio") != -1 || this.arrChoice[i].btn.indexOf("combo") != -1) {
                ctrlPlacement = new Object();
                ctrlPlacement.ctrlY = elem.offsetTop;
                ctrlPlacement.ctrlX = elem.offsetLeft;
                objBtnArr[objBtnArr.length] = elem;
                elem = document.getElementById(this.arrChoice[i].txt);
                if (elem) {
                    ctrlPlacement.txtY = elem.offsetTop;
                    ctrlPlacement.txtX = elem.offsetLeft;
                    objTxtArr[objTxtArr.length] = elem;
                    dX = elem.offsetLeft + elem.offsetWidth + 10;
                    dY = elem.offsetTop;
                }
                elem = document.getElementById(this.arrChoice[i].img);
                if (elem) {
                    ctrlPlacement.imgY = elem.offsetTop;
                    ctrlPlacement.imgX = elem.offsetLeft;
                    objImgArr[objImgArr.length] = elem;
                } else {
                    ctrlPlacement.imgY = dY;
                    ctrlPlacement.imgX = dX;
                    objImgArr[objImgArr.length] = null;
                }
                placementArr[placementArr.length] = ctrlPlacement;
            }
        }
    }

    if(!bUseOrder)
	{
		var tmpPlacementArr = placementArr.slice();
		placementArr = shuffle(placementArr);
		this.quOrd = [];
		
		for (var i = 0; i < tmpPlacementArr.length; i++) 
		{
			for(var j = 0; j < placementArr.length; j++)
			{
				if(tmpPlacementArr[i] == placementArr[j])
				{
					this.quOrd[i] = j;
					break;
				}	
			}			
		}
	}
	
    for (var i = 0; i < placementArr.length; i++) {
        var e = objTxtArr[i];
		var placementIndex = (bUseOrder?this.quOrd[i]:i);
        if (e) {
            e.style.top = placementArr[placementIndex].txtY + "px";
            e.style.left = placementArr[placementIndex].txtX + "px";
        }
        e = objBtnArr[i];
        if (e) {
            e.style.top = placementArr[placementIndex].ctrlY + "px";
            e.style.left = placementArr[placementIndex].ctrlX + "px";
        }
        e = objImgArr[i];
        if (e) {
            e.style.top = placementArr[placementIndex].imgY + "px";
            e.style.left = placementArr[placementIndex].imgX + "px";
        }
    }


}

function ObjInlineAddChoice(b,t,i) {
	var choice = new Object();
	choice.btn = b;
	choice.txt = t;
	choice.img = i;
	this.arrChoice[this.arrChoice.length] = choice;
}

function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}


function ObjInlineAddEvent(time, fn) {
    var TrivEvent = new Object();
    TrivEvent.time = time;
    TrivEvent.func = fn;
    TrivEvent.proc = false;
    this.arrEvents[this.arrEvents.length] = TrivEvent;

}

function ObjLoadProps()
{
	if(is.jsonData != null)
	{
		var respValues = is.jsonData[is.clientProp.device];
		var newValues;
		newValues = respValues[is.clientProp.width];
		var obj = newValues[this.name];
		if(obj)
		{
			this.x = typeof(obj.x)!="undefined"?obj.x:this.x;
			this.y = typeof(obj.y)!="undefined"?obj.y:this.y;
			this.w = typeof(obj.w)!="undefined"?obj.w:this.w;
			this.h = typeof(obj.h)!="undefined"?obj.h:this.h;
            if( typeof(obj.fsize) != "undefined" )
                this.fsize = obj.fsize;
			
			if(this.x > GetPageWidth() || ((this.x + this.w) < 0))
				this.bOffPage = true;
			else
				this.bOffPage = false;
		}
	}
}

function ObjRespChanges()
{
	var tempObj = {xOffset:0, yOffset:0, width: this.w, height: this.h, xOuterOffset:0, yOuterOffset:0};
		
	AdjustAttributesForEffects(this, tempObj);
	
	AdjustIFrameSize(this, tempObj);
	
	var svgFilterTag = document.getElementById(this.name+"Shadow");
	
	if(svgFilterTag)
		ModifySVGShadow(this, tempObj);
	
	if(this.iType === "youtube")
	{ 
	  var vidTag = document.getElementById("html5"+this.name);
	  if(vidTag)
	  {
		vidTag.width = this.w;
		vidTag.height = this.h;
	  }
	}
	
	
	FindAndModifyObjCSSBulk(this);
}

function IsHiddenAudioObj(audObj){
	if(audObj.obj.indexOf("audio") > -1 && !audObj.v)
		return true;
		
	return false;
}

function IsAudioObj(audObj){
	if( audObj.obj.indexOf("audio") > -1 )
		return true;
	
	return false;
}

function IsMedia(obj)
{
	if(obj.iType == 'flashvid' || obj.iType == 'flash' || obj.iType == 'wmp' ||obj.iType == 'youtube')
		return true;
	
	return false;
}

function IsRSSFeed(obj){
	if( obj.name.indexOf("webwidget") > -1 )
	{
		var div = document.getElementById(obj.name);
		if(div)
		{
			if(div.innerHTML.indexOf("feedControl") >-1)
				return true;
		}
	}
	
	return false;
}

function ObjInlineYouTubeParams(videoID, autoplay, controls, loop)
{
	this.vID = videoID;
	this.bLoop = loop;
	this.ytVar = {'autoplay':autoplay, 'controls':controls};
}

function ObjInlineAddYouTubeAPI(scriptURL)
{
	AddFileToHTML(scriptURL, 'script');
}

function ObjInlineCreatePlayer()
{
	if(is.YTScriptLoaded)
	{
		this.YTPlayer = new YT.Player('html5'+this.name, 
		{
			height: this.h,
			width: this.w,
			videoId: this.vID,
			playerVars: this.ytVar,
			events: { 'onStateChange': this.stateChange} 
		});
		this.YTPlayer.__TrivantisObject__ = this;
	}
	else
	{
		var THIS = this;
		setTimeout(function(){THIS.createPlayer();},500)
	}
}

function ObjInlinePlayerStateChange(event)
{
	var funcOnDone=0;
	var obj = event.target.__TrivantisObject__;
	try{funcOnDone=eval( obj.name + 'onDone' );}catch(error){}
	switch(event.data) 
	{
        case 0:
		{
			if(funcOnDone)
				funcOnDone(obj);
			else if(obj.bLoop)
				obj.YTPlayer.playVideo();
			break;
		}
	}
}

function ObjInlineaddAutoStart(bAutostart)
{
	this.bAutoStart = bAutostart;
}

function AdjustIFrameSize(obj, sizeObj)
{
	var iFrame = null;
	iFrame = document.getElementById(obj.name+"iframe");
	if(iFrame)
	{
		iFrame.width = sizeObj.width;
		iFrame.height = sizeObj.height;
	}
}

function IsTextWithEffect(obj)
{
	if(typeof(ObjText) != "undefined" && obj.constructor == ObjText)
	{
	 if((typeof(obj.hasOuterShadow) != "undefined" && obj.hasOuterShadow) || 
	   (typeof(obj.hasBorder) != "undefined" && obj.hasBorder > 0)|| 
	   (typeof(obj.hasTextShadow) != "undefined" && obj.hasTextShadow))
	   return true;
	}
	
	return false;
}

function ObjInlineChoiceOrder()
{
	if(this.quOrd)
		this.randomize(true);
		
}

function ObjInlineValidSource()
{
	if(this.bOffPage)
	{
		this.bOffPage = false;
		if(this.iType == 'flashvid' || this.iType == 'flash' || this.iType == 'wmp')
			this.actionChangeContents('');
	}
}