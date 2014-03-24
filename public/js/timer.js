$(function() {
  	var cpt = 30;
	setInterval(function(){
	    if(cpt > 0){
	    	--cpt;
	  		$("#timer span").text(cpt);
	    }
	    else{
	    	return false;
	    }
	}, 1000);
});