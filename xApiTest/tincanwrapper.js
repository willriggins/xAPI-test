/*******************************************************************************
**
** Filename: tincanwrapper.js
**
** File Description: This file contains the wrapper functions that allows the content
**                   to access the Tin Can functions in the titlemgr frameset.
**
** References: Tin Can API
**
*******************************************************************************/

var finishCalled = false;
var autoCommit = false;

function MySetValue( lmsVar, lmsVal ) {
var titleMgr = getTitleMgrHandle();
if( titleMgr ) titleMgr.setVariable(lmsVar,lmsVal,0);
LMSSetValue( lmsVar, lmsVal );
}

function loadPage( activityName, activityDesc ) {
var startDate = readVariable( 'TrivantisSCORMTimer', 0 );
saveVariable( 'TrivantisEPS', 'F' );
if( startDate == 0 ) {
LMSInitialize( activityName, activityDesc );
	var status = new String( LMSGetValue( "cmi.core.lesson_status" ) );
	status = status.toLowerCase();
	if (status == "not attempted")
		MySetValue( "cmi.core.lesson_status", "attempted" );

	startTimer();
	return true;
}
else return false;
}

function startTimer() {
var startDate = new Date().getTime();
saveVariable('TrivantisSCORMTimer',startDate);
}

function doBack() {
MySetValue( "cmi.core.exit", "suspend" );
saveVariable( 'TrivantisEPS', 'T' );
finishCalled = true;
LMSFinish();
saveVariable( 'TrivantisSCORMTimer', 0 );
}

function doContinue( status ) {
MySetValue( "cmi.core.exit", "" );
var mode = new String( LMSGetValue( "cmi.core.lesson_mode" ) );
mode = mode.toLowerCase();
if ( mode != "review"  &&  mode != "browse" ) MySetValue( "cmi.core.lesson_status", status );
saveVariable( 'TrivantisEPS', 'T' );
finishCalled = true;
LMSFinish();
saveVariable( 'TrivantisSCORMTimer', 0 );
}

function doQuit(bForce){
saveVariable( 'TrivantisEPS', 'T' );
finishCalled = true;
LMSFinish();
saveVariable( 'TrivantisSCORMTimer', 0 );
if( bForce && window.myTop ) window.myTop.close();
}

function unloadPage(bForce, titleName)
{
	var exitPageStatus = readVariable('TrivantisEPS', 'F');
	if (exitPageStatus != 'T')
	{
		if (window.name.length > 0 && window.name.indexOf('Trivantis_') == -1)
			trivScormQuit(bForce, titleName, false);
	}
}


function findxAPI(win) 
{
   // Search the window hierarchy for the TitleMgr Frame.

   if (win.length > 0)  // does the window have frames?
   {
      if (win.frames['titlemgrframe'] != null)
      {
         return win.frames['titlemgrframe'];
      }

      for (var i=0;i<win.length;i++)
      {
         var theAPI = findxAPI(win.frames[i]);
         if (theAPI != null)
         {
            return theAPI;
         }
      }
   }
   return null;
}

var tcAPI = findxAPI(trivTop());

function LMSInitialize( activityName, activityDesc )
{
return tcAPI.LMSInitialize( activityName, activityDesc );
}

function LMSFinish()
{
return tcAPI.LMSFinish();
}

function LMSGetValue(name)
{
return tcAPI.LMSGetValue(name);
}

function LMSSetValue(name, value)
{
return tcAPI.LMSSetValue(name, value);
}

function LMSCommit()
{
return tcAPI.LMSCommit();
}

function LMSGetLastError()
{
return tcAPI.LMSGetLastError();
}

function LMSGetErrorString(errorCode)
{
return tcAPI.LMSGetErrorString(errorCode);
}

function LMSGetDiagnostic(errorCode)
{
return tcAPI.LMSGetDiagnostic(errorCode);
}

function LMSGetBookmark()
{
return tcAPI.LMSGetBookmark();
}

function LMSSetBookmark(strHtml,strName)
{
return tcAPI.LMSSetBookmark(strHtml,strName);
}

function putSCORMInteractions(id,obj,tim,typ,crsp,wgt,srsp,res,lat,txt,chc,answ)
{
return tcAPI.putSCORMInteractions(id,obj,tim,typ,crsp,wgt,srsp,res,lat,txt,chc,answ);
}

function LMSTinCanStatement(strVerb,strObj,strScore)
{
return tcAPI.LMSTinCanStatement(strVerb,strObj,strScore);
}

function LMSTinCanSetStatus(strVerb)
{
return tcAPI.LMSTinCanSetStatus(strVerb);
}