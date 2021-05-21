$(document).ready(function()
{
    $.ajax(
    {
        url: "getReviews.php?getWhat=allReviews",
        success: function(response)
        {
            console.log(response);
            let responseJSON = JSON.parse(response);
            setData(responseJSON);
        },
        error: function(error)
        {
            console.log(error);
        }
    });

    $(".container-fluid").on("click", ".card button", function(e)
    {
        e.preventDefault();
        let reviewId = $(this).attr("value");
        window.location.href = "review.html?id="+reviewId;
    });
});

function setData(data)
{
    if(data == null)
        $(".jumbotron").find("h1").html("No reviews found");
        
    else
    {
        $(".jumbotron").find("h1").html("REVIEWS");
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