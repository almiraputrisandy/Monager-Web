<?php
include "dbconnect.php";
session_start();

$sql = mysqli_query($conn,"select * from category");
while($row = mysqli_fetch_array($sql)){
    $catID = $row['catID'];
    $catName = $row['catName'];
    
    $array[] = ["catID"=>$catID, "catName"=>$catName];
}

echo json_encode($array);
?>