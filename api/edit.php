<?php
error_reporting(E_ALL & ~E_NOTICE);
include "dbconnect.php";
session_start();

// get value
$input = json_decode(file_get_contents("php://input"), true);

//get the action type
$type = $_GET['type'];
$id = $_GET['id'];

//retrieve data
$userID = $_SESSION['loggedUserID'];
$amount = $input; //Limit to be updated

//data to update user
$fullname = $input['fullname'];
$editEmail = $input['email'];
$bankBal = $input['bankBal'];
$accType = $input['accType'];
$password = $input['password'];

//data to update expenses & income
$name = $input['name'];
$amount = $input['amount'];
$category = $input['category'];
$date = $input['date'];
$date = date("Y-m-d", strtotime($input['date']));

//echo ("<script>console.log('id: ". $id. "')</script>");


$accSql = "UPDATE user SET fullName = '$fullname', email = '$editEmail', accType = '$accType' WHERE id = '$userID'";
$accSqlWithPass = "UPDATE user SET fullName = '$fullname', email = '$editEmail', accType = '$accType', password = '$password' WHERE id = '$userID'";

//echo ("<script>console.log('accSqlWithPass: ". $accSqlWithPass. "')</script>");

if($type == "limit"){
    $sql = "UPDATE user SET dailyLimit = '$input' WHERE id = '$userID'";
    $result = mysqli_query($conn,$sql);
    if($result){
        echo "Daily Limit Updated!";
    }
}

if($type == "account"){
    if($password == null){
        $update1 = mysqli_query($conn,$accSql);
        if($update1){
            $_SESSION['loggedUser'] = $editEmail;
            echo "Account Updated!";
        }
    }else{
        $update2 = mysqli_query($conn,$accSqlWithPass);
        if($update2){
            $_SESSION['loggedUser'] = $editEmail;
            echo "Account Updated!";
        }
    }
}


    $sql2 = "SELECT * FROM category WHERE catName = '$category'";
    $sql3 = 'INSERT INTO `category`(catName) VALUES("'.$category.'")';
    
    $check = mysqli_query($conn, $sql2);
    if($check){
        $row = mysqli_fetch_array($check);
        if(empty($row)){
            mysqli_query($conn,$sql3); 
            $check2 = mysqli_query($conn,$sql2);
            $row2 = mysqli_fetch_array($check2);
            
            $category = $row2['catID'];
            
            $expSql = "UPDATE expenses SET name = '$name', amount = '$amount', category = '$category', date = '$date' WHERE id = '$id'";
            $incSql = "UPDATE income SET name = '$name', amount = '$amount', category = '$category', date = '$date' WHERE id= '$id'";
            
            if($type == "expense"){
                $expUpdate = mysqli_query($conn,$expSql);
                if($expUpdate){
                    echo "Update Successful!";
                }else{
                    echo "Error";
                }
            }else if($type == "income"){
                $incUpdate = mysqli_query($conn,$incSql);
                if($incUpdate){
                    echo "Update Successful!";
                }else{
                    echo $incUpdate;
                }
            }
            
            
            
        }else{
            $category = $row['catID'];
            
            $expSql = "UPDATE expenses SET name = '$name', amount = '$amount', category = '$category', date = '$date' WHERE id = '$id'";
            $incSql = "UPDATE income SET name = '$name', amount = '$amount', category = '$category', date = '$date' WHERE id= '$id'";
            
            if($type == "expense"){
                $expUpdate = mysqli_query($conn,$expSql);
                if($expUpdate){
                    echo "Update Successful!";
                }else{
                    echo "Error";
                }
            }else if($type == "income"){
                $incUpdate = mysqli_query($conn,$incSql) or die (mysqli_error($conn));
                if($incUpdate){
                    echo "Update Successful!";
                }else{
                    echo $incUpdate;
                }
            }
        }
    }

?>
