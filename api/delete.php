<?php
include "dbconnect.php";
session_start();

// get value
//$input = json_decode(file_get_contents("php://input"), true);
$type = $_GET['type'];
$id = $_GET['id'];
//echo ("<script>console.log('id: ". $id. "')</script>");
//echo ("<script>console.log('type: ". $type. "')</script>");
$sql = "DELETE FROM expenses WHERE id = '$id'";
$sql2 = "DELETE FROM income WHERE id = '$id'";

if($type == "expense"){
    $result = mysqli_query($conn,$sql);
    if($result){
        echo "Expense Deleted";
    }else{
        echo "Error";
    }
}

if($type == "income"){
    $result = mysqli_query($conn,$sql2);
    if($result){
        echo "Income Deleted";
    }else{
        echo "Error";
    }
}

?>