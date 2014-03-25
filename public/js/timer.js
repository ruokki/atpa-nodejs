$("document").ready(function(){
	timer();
});


function timer(){
  	var cpt = 5;	// valeur à changer 
  	$("#timer span").text(cpt);
	setInterval(function(){
	    if(cpt > 0){
	    	--cpt;
	  		$("#timer span").text(cpt);
	    }
	    else{
	    	
	    	return;
	    }
	}, 1000);
}