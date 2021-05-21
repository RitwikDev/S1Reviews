$(document).ready(function()
{
    $.ajax(
    {
        url: "getReviews.php?getWhat=allBrands",
        success: function(response)
        {
            let responseJSON = JSON.parse(response);
            setBrands(responseJSON);
        },
        error: function(error)
        {
            console.log(error);
        }
    });

    $("#searchBox").on("input", function()
    {
        let searchTerm = $("#searchBox").val();
        if(searchTerm == null || searchTerm.length == 0 || searchTerm == "")
            $("#searchButton").prop("disabled", true);
            
        else
            $("#searchButton").prop("disabled", false);
    });

    $("#searchButton").click(function(e)
    {
        e.preventDefault();
        let searchTerm = $("#searchBox").val();
        if(searchTerm != null && searchTerm != "")
            window.location.href = "searchResults.html?searchTerm="+searchTerm;
    });

    $(".dropdown-menu").on("click", "button", function(e)
    {
        e.preventDefault();
        window.location.href = "searchResults.html?brandName="+$(this).attr("value");
    });
});

function setBrands(data)
{
    for(let i=0; i<data.length; i=i+1)
    {
        let dropdownItem = "<button class=\"btn btn-link dropdown-item\" value=\""+data[i].BrandName+"\">"+data[i].BrandName+"</button>";
        $(".dropdown-menu").append(dropdownItem);
    }
}