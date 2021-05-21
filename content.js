var contents;
$(document).ready(function()
{
    $.ajax(
    {
        url: "getReviews.php?id=1",
        success: function(response)
        {
            // console.log(response);
            // console.log(JSON.parse(response));
            setContents(JSON.parse(response));
            console.log(contents);
        },
        error: function(error)
        {
            console.log(error);
        }
    });
    
});

function setContents(data)
{
    contents =
    {
        pageTopText: data.ProductName,

        overview: 
        {
            heading: data.OverviewHeading,

            article: data.OverviewArticle,

            image: data.OverviewImage,

            textOnImage: data.OverviewTextOnImage
        },

        display: 
        {
            heading: data.DisplayHeading,

            article: data.DisplayArticle,

            image: data.DisplayImage,

            textOnImage: data.DisplayTextOnImage
        },

        camera: 
        {
            heading: data.CameraHeading,

            article: data.CameraArticle,

            image: data.CameraImage,

            textOnImage: data.CameraTextOnImage
        },

        battery: 
        {
            heading: data.BatteryHeading,

            article: data.BatteryArticle,

            image: data.BatteryImage,

            textOnImage: data.BatteryTextOnImage
        },

        performance: 
        {
            heading: data.PerformanceHeading,

            article: data.PerformanceArticle,

            image: data.PerformanceImage,

            textOnImage: data.PerformanceTextOnImage
        },

        miscellaneous: 
        {
            heading: data.MiscellaneousHeading,

            article: data.MiscellaneousArticle,

            image: data.MiscellaneousImage,

            textOnImage: data.MiscellaneousTextOnImage
        },

        summary: 
        {
            heading: data.SummaryHeading,

            article: data.SummaryArticle,

            image: data.SummaryImage,

            textOnImage: data.SummaryTextOnImage
        }
    };
}