<?php
include "dbconnect.php";
session_start();

$user = $_SESSION['loggedUserID'];
$sql = mysqli_query($conn,"select id, name, amount, catName, date from income join category where email = '$user' and income.category = category.catID ORDER BY date DESC");
while($row = mysqli_fetch_array($sql)){
    $incName = $row['name'];
    $incAmount = $row['amount'];
    $incCategory = $row['catName'];
    $incDate = $row['date'];
    $incID = $row['id'];
    
    $array[] = ["id"=>$incID, "name"=>$incName, "amount"=>$incAmount, "category"=>$incCategory, "date"=>$incDate, "type"=>"income"];
    if(empty($row)){
        $array = null;
    }
}

echo json_encode($array);

if(!isset($_SESSION['loggedUser'])){
	header("location: index.html");
}
?>