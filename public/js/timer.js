function timer(callback){
  	var cpt = $("#value-timer").val();
  	$("#btn-stat").hide();
  	$("#timer span").text(cpt);
	var interval = setInterval(function(){
	    if(cpt > 0){
	    	--cpt;
	  		$("#timer span").text(cpt);
	    }
	    else{
	    	$("#btn-stat").show(200);
	    	clearInterval(interval);
	    	callback();
	    }
	}, 1000);
}