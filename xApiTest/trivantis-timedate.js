/**************************************************
Trivantis (http://www.trivantis.com)
**************************************************/

//functions for realtime date/time
function FormatLocaleDS( now ) {
    return now.toLocaleDateString()
}

function FormatLocaleTS( now ) {
    var time = now.toLocaleTimeString()
	var timeParts = time.split(":");
	if ( timeParts.length > 2 )
	{
		time = timeParts[0];
		time += ":";
		time += timeParts[1];
		time += timeParts[2].replace(/^[^0-9]*[0-9]+/,"")
	}
    return time;
}

function FormatETS( eT ) {
  var mills = eT % 1000
  eT -= mills
  eT /= 1000
  var secs = eT % 60
  eT -= secs
  eT /= 60
  var mins = eT % 60
  eT -= mins
  eT /= 60
  var hours = eT
  if( hours < 10 ) hours = "0" + hours
  if( mins < 10 ) mins = "0" + mins
  if( secs < 10 ) secs = "0" + secs
  return hours + ':' + mins + ':' + secs
}

function CalcTD( f, val ) {
  var tV = 0
  if( f == 1 ) tV += 24 * 60 * 60 * 1000 * val
  else if( f == 2 ) tV += 60 * 1000 * val
  else if( f == 4 ) tV += 1000 * val
  return tV
}
