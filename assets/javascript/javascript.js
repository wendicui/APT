$(document).ready(function(){



    function firstsearch() {
        window.location.href = "search.html";
    }

    $("#firstsearch").click(firstsearch);

 // create function for click event   
    function drawData(){
        console.log("working")
        var address1 = "468%20SEQUOIA%20DR"
        var address2 = "SMYRNA%2C%20DE"
        var radius = "20"
        var min 
        var max

        var url = `https://search.onboard-apis.com/propertyapi/v1.0.0/
        assessment/snapshot?address1=${address1}&address2=${address2}
        &radius=${radius}`

        $.ajax({
            url:url,
            method:"get",
            headers:{
                'apikey': "aca334dc11f0a75eede8b6a5842796ab"
            }
        }).done(function(data){
            console.log(data)
        })
}



    $("button").on("click", drawData)

});
