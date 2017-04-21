define("info", ['map', "jquery", "userservice" , "dataAdmin" , 'chartInformations'], function(map, j, us, da, ch) {
    // dom操作
    var generate = $('#left-sidebar .mission .generate');
    var inventory = $('#left-sidebar .mission .inventory');
    generate.click(function(){
        alert(1);
    })
    // da.sendRequest.GetCategory();
})
