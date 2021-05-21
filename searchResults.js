$(window).ready(function()
{
    let key = window.location.search.substring(1).split("=")[0];
    let value = window.location.search.substring(1).split("=")[1].replaceAll("%20", " ");
    
    if(key == "searchTerm")
    {
        $.ajax(
        {
            url: "getReviews.php?getWhat=searchReviews&value="+value,
            success: function(response)
            {
                let responseJSON = JSON.parse(response);
                setData(responseJSON,key, value);
            },
            error: function(error)
            {
                console.log(error);
            }
        });
    }

    else if(key == "brandName")
    {
        $.ajax(
        {
            url: "getReviews.php?getWhat=reviewsOfBrand&value="+value,
            success: function(response)
            {
                let responseJSON = JSON.parse(response);
                setData(responseJSON,key, value);
            },
            error: function(error)
            {
                console.log(error);
            }
        });
    }

    else
        setSomethingWrong();

    $(".container-fluid").on("click", ".card button", function(e)
    {
        e.preventDefault();
        let reviewId = $(this).attr("value");
        window.location.href = "review.html?id="+reviewId;
    });
});

function setData(data, key, value)
{
    if(key == "searchTerm")
    {
        $(".jumbotron").find("h1").html("Showing results for <em>"+value+"</em>");
        if(data == null || data.length == 0)
            $(".jumbotron").find("p").text("Try searching for something else.").css("display", "block");
    }

    else if(key == "brandName")
    {
        $(".jumbotron").find("h1").html("Showing reviews of <em>"+value+"</em> only.");
        if(data == null || data.length == 0)
            $(".jumbotron").find("p").text("There are no reviews of "+value+".").css("display", "block");
    }

    if(data != null && data.length > 0)
    {
        let j=0;
        for(let i=0; i<data.length; i=i+1)
        {
            let reviewId = data[i].ReviewId;
            let name = data[i].ProductName.replace("\\/", "/");
            let image = data[i].CoverImage.replace("\\/", "/");

            let card = "<div class=\"card\" style=\"width: 18rem;\">"+
                            "<img class=\"card-img-top\" alt=\""+name+"\" src=\""+image+"\">"+
                            "<div class=\"card-body text-center\">"+
                                "<button class=\"btn btn-link text-dark\" value=\""+reviewId+"\">"+name+"</button>"+
                            "</div>"+
                        "</div>";

            if(i%3 == 0)
            {
                j=j+1;
                let newRow = "<div class=\"row\" id=\"row-"+j+"\">"+
                                "<div class=\"col\" id=\"col-0\">"+
                                    "<div class=\"d-flex justify-content-center\"></div>"+
                                "</div>"+
                                "<div class=\"col\" id=\"col-1\">"+
                                    "<div class=\"d-flex justify-content-center\"></div>"+
                                "</div>"+
                                "<div class=\"col\" id=\"col-2\">"+
                                    "<div class=\"d-flex justify-content-center\"></div>"+
                                "</div>"+
                            "</div>";
                $(".container-fluid").append(newRow);
                $("#row-"+j).find("#col-0").find(".d-flex").append(card);
            }

            else if(i%3 == 1)
                $("#row-"+j).find("#col-1").find(".d-flex").append(card);
            
            else
                $("#row-"+j).find("#col-2").find(".d-flex").append(card);
        }
    }
}

function setSomethingWrong()
{
    $(".jumbotron").find("h1").html("Something went wrong.");
}