define("config",function(){
	var CONFIG={
			COLOR: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
			getColor: function(index){
				if(index > CONFIG.COLOR.length)
					index = index%CONFIG.COLOR.length;
				return CONFIG.COLOR[index];
			}
		};
	return T = {
		CONFIG: CONFIG
	}
});