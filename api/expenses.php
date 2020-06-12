<?php
include "dbconnect.php";
session_start();

$user = $_SESSION['loggedUserID'];
$sql = mysqli_query($conn,"select id, name, amount, catName, date from expenses join category where email = '$user' and expenses.category = category.catID ORDER BY date DESC");
while($row = mysqli_fetch_array($sql)){
    $expName = $row['name'];
    $expAmount = $row['amount'];
    $expCategory = $row['catName'];
    $expDate = $row['date'];
    $expID = $row['id'];
    
    $array[] = ["id"=>$expID, "name"=>$expName, "amount"=>$expAmount, "category"=>$expCategory, "date"=>$expDate, "type"=>"expense"];
}

echo json_encode($array);
?>