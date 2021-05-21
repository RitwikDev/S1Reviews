<?php
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "review_database";
    $port = 8889;
    
    // Create connection
    $conn = new mysqli($servername . ":" . $port, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error)
      die("Connection failed: " . $conn->connect_error);
?>