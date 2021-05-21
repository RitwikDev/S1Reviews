<?php
    require_once("connect.php");

    function getAllReviews()
    {
        global $conn;
        $sql = "SELECT * FROM review";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        return json_encode($data);
    }

    function getOneReview()
    {
        global $conn;
        if(isset($_GET["id"]))
        {
            $reviewId = $_GET["id"];
            $sql = "SELECT * FROM overview o, display d, camera c, battery b, performance p, miscellaneous m, 
                    summary s, review r where o.ReviewId = d.ReviewId = c.ReviewId = b.ReviewId = p.ReviewId = m.ReviewId = 
                    s.ReviewId = r.ReviewId = ?";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $reviewId);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_assoc();
            return json_encode($data);
        }
    }

    function getAllBrands()
    {
        global $conn;
        $sql = "SELECT distinct BrandName FROM review";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        return json_encode($data);
    }

    function searchReviews()
    {
        global $conn;
        $value = $_GET["value"];
        $value = "%$value%";
        $sql = "select * from review where BrandName like ? or ProductName like ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $value, $value);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        return json_encode($data);
    }

    function reviewsOfBrand()
    {
        global $conn;
        $value = $_GET["value"];
        $sql = "select * from review where BrandName like ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $value);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        return json_encode($data);
    }

    function preloadAnimationFrames()
    {
        global $conn;
        if(isset($_GET["id"]))
        {
            $reviewId = $_GET["id"];
            $sql = "SELECT o.OverviewImage, d.DisplayImage, c.CameraImage, b.BatteryImage, p.PerformanceImage, 
                    m.MiscellaneousImage, s.SummaryImage FROM overview o, display d, camera c, battery b, 
                    performance p, miscellaneous m, summary s, review r where o.ReviewId = d.ReviewId = 
                    c.ReviewId = b.ReviewId = p.ReviewId = m.ReviewId = s.ReviewId = r.ReviewId = ?";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $reviewId);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_assoc();
            return json_encode($data);
        }
    }
   
    $getWhat = $_GET["getWhat"];

    if($getWhat == "allReviews")
        echo getAllReviews();
    
    else if($getWhat == "oneReview")
        echo getOneReview();
    
    else if($getWhat == "allBrands")
        echo getAllBrands();

    else if($getWhat == "searchReviews")
        echo searchReviews();

    else if($getWhat == "reviewsOfBrand")
        echo reviewsOfBrand();

    else if($getWhat == "preloadAnimationFrames")
        echo preloadAnimationFrames();

    mysqli_close($conn);
?>