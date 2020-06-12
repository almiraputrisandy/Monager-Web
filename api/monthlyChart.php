<?php
include "dbconnect.php";
session_start();

$email = $_SESSION['loggedUserID'];

$monthlyExpSql = "SELECT SUM(amount) as totalExp, YEAR(date) as expYear, MONTH(date) as expMonth FROM expenses JOIN category WHERE expenses.category = category.catID AND expenses.email = '$email' GROUP BY expMonth, expYear";
$monthlyExpSqlByCategory = "SELECT catName, SUM(amount) as totalExp, YEAR(date) as expYear, MONTH(date) as expMonth FROM expenses JOIN category WHERE expenses.category = category.catID AND expenses.email = '$email' GROUP BY expMonth, expYear, catID";

$monthlyIncSql = "SELECT SUM(amount) as totalInc, YEAR(date) as incYear, MONTH(date) as incMonth FROM income JOIN category WHERE income.category = category.catID AND income.email = '$email' GROUP BY incMonth, incYear";
$monthlyIncSqlByCategory = "SELECT catName, SUM(amount) as totalInc, YEAR(date) as incYear, MONTH(date) as incMonth FROM income JOIN category WHERE income.category = category.catID AND income.email = '$email' GROUP BY incMonth, incYear, catID";

$result = mysqli_query($conn,$monthlyExpSql);
$result2 = mysqli_query($conn,$monthlyIncSql);
$result3 = mysqli_query($conn,$monthlyExpSqlByCategory);
$result4 = mysqli_query($conn,$monthlyIncSqlByCategory);

while($exp = mysqli_fetch_array($result)){
    $array[0][] = ["expAmount"=>$exp['totalExp'], "expMonth"=>$exp['expMonth'], "expYear"=>$exp['expYear']];
}

while($inc = mysqli_fetch_array($result2)){
    $array[1][] = ["incAmount"=>$inc['totalInc'], "incMonth"=>$inc['incMonth'], "incYear"=>$inc['incYear']];
}

while($exp = mysqli_fetch_array($result3)){
    $array[2][] = ["category"=>$exp['catName'], "expAmount"=>$exp['totalExp'], "expMonth"=>$exp['expMonth'], "expYear"=>$exp['expYear']];
}

while($inc = mysqli_fetch_array($result4)){
    $array[3][] = ["category"=>$inc['catName'], "incAmount"=>$inc['totalInc'], "incMonth"=>$inc['incMonth'], "incYear"=>$inc['incYear']];
}

echo json_encode($array);
?>