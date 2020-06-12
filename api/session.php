<?php
include "dbconnect.php";
session_start();

$user = $_SESSION['loggedUserID'];
$sql = mysqli_query($conn,"SELECT *, (select round(sum((select sum(amount) from income where email = '$user')-(select sum(amount) from expenses where email = '$user')),2)) as balance, (select sum(amount) from income where email = '$user') as totalInc, (select sum(amount) from expenses where email = '$user') as totalExp FROM user WHERE id = '$user'");
$row = mysqli_fetch_array($sql,MYSQLI_ASSOC);
$name = $row['fullName'];
$email = $row['email'];
$pass = $row['password'];
$balance = $row['balance'];
$limit = $row['dailyLimit'];
$accType = $row['accType'];

if(empty($balance)){
    $balance = 0;
}

if(!empty($row['totalInc']) && empty($row['totalExp'])){
    $balance = $row['totalInc'];
}

$array[] = ["name"=>$name, "email"=>$email, "password"=>$pass, "balance"=>$balance, "limit"=>$limit, "accType"=>$accType];
echo json_encode($array);

if(!isset($_SESSION['loggedUser'])){
	header("location: index.html");
}
?>