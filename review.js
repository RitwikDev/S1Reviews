var productName, contents, currentContentId = "", pageTopTextSet = false, images = [];

$(document).ready(function()
{
    $(window).scrollTop(0);
    let key = window.location.search.substring(1).split("=")[0];
    let reviewId = window.location.search.substring(1).split("=")[1];
    
    if(key == "id")
    {
        $.ajax(
        {
            url: "getReviews.php?getWhat=oneReview&id="+reviewId,
            success: function(response)
            {
                let responseJSON = JSON.parse(response);
                if(responseJSON != null)
                {
                    setContents(responseJSON);
                    setPageContents();
                    setObservers();
                }

                else
                    setNoReviewFound();
            },
            error: function(error)
            {
                console.log(error);
            }
        });

        $.ajax(
        {
            url: "getReviews.php?getWhat=preloadAnimationFrames&id="+reviewId,
            success: function(response)
            {
                let responseJSON = JSON.parse(response);
                preloadAnimationFrames(responseJSON);
            },
            error: function(error)
            {
                console.log(error);
            }
        });
    }

    else
        setSomethingWrong();

    $(document).scroll(function()
    {
        if(key == "id")
            documentScrolled();
    });
});

function setPageContents()
{
    let dropdown = "<div class=\"dropdown\">"+
                        "<button class=\"btn btn-link dropdown-toggle\" type=\"button\" id=\"jumpToButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" style=\"color: black; font-size: 1.4vw;\">"+
                            "Jump to ..."+
                        "</button>"+
                        "<div class=\"dropdown-menu\" aria-labelledby=\"jumpToButton\">";

    for(let i in contents)
    {
        let imageContainer = "<div class=\"container-fluid imageContainer\" id=\"imageContainer-"+i+"\">"+
                                "<div class=\"row positionSticky\" id=\"stickyTarget-"+i+"\">"+
                                    "<div class=\"col \">"+
                                        "<h1 class=\"display-2 carousel-caption selectDisable\" id=\"text-"+i+"\">"+contents[i]["textOnImage"]+"</h1>"+
                                        "<img alt=\"image\" id=\"img-"+i+"\" class=\"selectDisable center\" src=\""+contents[i]["image"]+"\">"+
                                    "</div>"+
                                "</div>"+
                            "</div>";

        let textContainer = "<div class=\"container-fluid textContainer\" id=\"textContainer-"+i+"\">"+
                                "<div class=\"row\">"+
                                    "<div class=\"col-1\"></div>"+
                                    "<div class=\"col-10 text-center sectionHeadingCol\">"+
                                        "<h1 id=\"sectionHeading-"+i+"\">"+contents[i]["heading"]+"</h1>"+
                                    "</div>"+
                                    "<div class=\"col-1\"></div>"+
                                "</div>"+
                                "<div class=\"row\">"+
                                    "<div class=\"col-1\"></div>"+
                                    "<div class=\"col-10 sectionArticleCol\">"+
                                        "<p id=\"sectionArticle-"+i+"\">"+contents[i]["article"]+"</p>"+
                                    "</div>"+
                                    "<div class=\"col-1\"></div>"+
                                "</div>"+
                            "</div>";

        dropdown = dropdown + "<a class=\"dropdown-item\" href=\"#imageContainer-"+i+"\">"+contents[i]["heading"]+"</a>";

        $("#mainContent").append(imageContainer);
        $("#mainContent").append(textContainer);
    }

    dropdown = dropdown + "</div>"+
                        "</div>";

    $("#pageTopTextRight").append(dropdown);
}

function setObservers()
{
    for(let i in contents)
    {
        let options = 
        {
            root: document.querySelector("#rootElement"),
            rootMargin: "0px",
            threshold: 0
        };
        let observer = new IntersectionObserver(callback, options);
        let target = document.querySelector("#stickyTarget-"+i);
        observer.observe(target);
    }
}

let callback = (entries, observer) =>
{
    entries.forEach(entry =>
    {
        if(entry.intersectionRatio > 0)
        {
            let targetId = entry.target.getAttribute("id");
            currentContentId = targetId;
        }
    });
};

function documentScrolled()
{
    $("#rootElement").css("transform", "translateY("+window.scrollY+"px)");
    $("#mainContent").css("transform", "translateY(-"+window.scrollY+"px)");
    findDistance();
}

function findDistance()
{
    // let distanceTop = window.pageYOffset + document.getElementById(currentContentId).getBoundingClientRect().top;
    if(currentContentId.length > 0)
    {
        let parentOffset = $("#"+currentContentId).parent(".imageContainer").offset().top;
        let parentHeight = $("#"+currentContentId).parent(".imageContainer").height();
        let currentContentOffset = $("#"+currentContentId).offset().top;
        let distance =  currentContentOffset - parentOffset;
        let percent = distance/parentHeight*100;    //Maximum value is 85.9375
        animate(percent);
    }
}

function animate(percent)
{
    let finalPercent = changeImage(percent);
    moveText(finalPercent);
    setPageTopText(finalPercent);
}

function changeImage(percent)
{
    //Using range: 1 to 83
    //Percent = 1 => image = 1
    //Percent = 83 > image = 360 (Last frame of animation)

    
    let imageSrc, imageNum;
    let section = currentContentId.split("-")[1];
    switch(section)
    {
        case "overview":    imageSrc = contents.overview["imagesLocation"];
                            break;

        case "display": imageSrc = contents.display["imagesLocation"];
                        break;

        case "camera":  imageSrc = contents.camera["imagesLocation"];
                        break;

        case "battery": imageSrc = contents.battery["imagesLocation"];
                        break;

        case "performance": imageSrc = contents.performance["imagesLocation"];
                            break;

        case "miscellaneous":   imageSrc = contents.miscellaneous["imagesLocation"];
                                break;

        case "summary": imageSrc = contents.summary["imagesLocation"];
                        break;
    }

    let finalPercent = percent/83*100;      //83 is used because 85.9375 was obsereved to be the maximum distance
    finalPercent = (finalPercent > 100)? 100 : finalPercent;

    imageNum = Math.round(finalPercent*360/100);    //360 is used in denominator because there are 360 frames in the animation
    imageNum = (imageNum == 0)? 1 : imageNum;
    imageNum = imageNum.toString().padStart(4, "0");
    imageSrc = imageSrc + imageNum + ".jpg";

    $("#"+currentContentId).find("img").attr("src", imageSrc);
    return finalPercent;
}

function setPageTopText(finalPercent)
{
    if(!pageTopTextSet)
    {
        let position = 100 - finalPercent;
        let text = productName;
        $("#pageTopTextLeft").html(text);
        $("#pageTopText").css("display", "block").removeClass("removePageTopText").addClass("setPageTopText").css("top", "0");

        if(position == 0)
            pageTopTextSet = true;
    }

    if(window.scrollY == 0)
    {
        $("#pageTopText").addClass("removePageTopText").removeClass("setPageTopText");
        pageTopTextSet = false;
    }

    let sectionHeading = $("#sectionHeading-"+currentContentId.split("-")[1]).html();
    $("#pageTopTextMiddle").html(sectionHeading).css("opacity", finalPercent/100);
}

function moveText(finalPercent)
{
    finalPercent = (finalPercent < 1)? 1 : finalPercent;
    $("#"+currentContentId).find("h1").css("opacity", (100-2*finalPercent)/100)
                                        .css("top", top+"%");
}

function setContents(data)
{
    productName = data.ProductName;
    contents =
    {
        overview: 
        {
            heading: data.OverviewHeading,
            article: data.OverviewArticle,
            image: data.OverviewImage,
            textOnImage: data.OverviewTextOnImage,
            imagesLocation: data.OverviewImage.substr(0, (data.SummaryImage.indexOf(".jpg")-4))
        },

        display: 
        {
            heading: data.DisplayHeading,
            article: data.DisplayArticle,
            image: data.DisplayImage,
            textOnImage: data.DisplayTextOnImage,
            imagesLocation: data.DisplayImage.substr(0, (data.SummaryImage.indexOf(".jpg")-4))
        },

        camera: 
        {
            heading: data.CameraHeading,
            article: data.CameraArticle,
            image: data.CameraImage,
            textOnImage: data.CameraTextOnImage,
            imagesLocation: data.CameraImage.substr(0, (data.SummaryImage.indexOf(".jpg")-4))
        },

        battery: 
        {
            heading: data.BatteryHeading,
            article: data.BatteryArticle,
            image: data.BatteryImage,
            textOnImage: data.BatteryTextOnImage,
            imagesLocation: data.BatteryImage.substr(0, (data.SummaryImage.indexOf(".jpg")-4))
        },

        performance: 
        {
            heading: data.PerformanceHeading,
            article: data.PerformanceArticle,
            image: data.PerformanceImage,
            textOnImage: data.PerformanceTextOnImage,
            imagesLocation: data.PerformanceImage.substr(0, (data.SummaryImage.indexOf(".jpg")-4))
        },

        miscellaneous: 
        {
            heading: data.MiscellaneousHeading,
            article: data.MiscellaneousArticle,
            image: data.MiscellaneousImage,
            textOnImage: data.MiscellaneousTextOnImage,
            imagesLocation: data.MiscellaneousImage.substr(0, (data.SummaryImage.indexOf(".jpg")-4))
        },

        summary: 
        {
            heading: data.SummaryHeading,
            article: data.SummaryArticle,
            image: data.SummaryImage,
            textOnImage: data.SummaryTextOnImage,
            imagesLocation: data.SummaryImage.substr(0, (data.SummaryImage.indexOf(".jpg")-4))
        }
    };
}

function setNoReviewFound()
{
    let jumbotron = "<div class=\"jumbotron jumbotron-fluid\">"+
                        "<div class=\"container\">"+
                        "<h1 class=\"display-4 text-center\">No review found.</h1>"+
                        "</div>"+
                    "</div>";

    $("#mainBody").append(jumbotron).css("display", "none").fadeIn(1000);
}

function setSomethingWrong()
{
    let jumbotron = "<div class=\"jumbotron jumbotron-fluid\">"+
                        "<div class=\"container\">"+
                        "<h1 class=\"display-4 text-center\">Something went wrong.</h1>"+
                        "</div>"+
                    "</div>";

    $("#mainBody").append(jumbotron).css("display", "none").fadeIn(1000);
}

function preloadAnimationFrames(data)
{
    for(let i in data)
    {
        let imageLocation = data[i].substring(0, (data[i].indexOf(".jpg")-4));
        for(let j=1; j<=360; j=j+1)
        {
            let imageSrc = imageLocation + j.toString().padStart(4, "0") + ".jpg";
            images[i] = new Image();
            images[i].src = imageSrc;
        }
    }
}