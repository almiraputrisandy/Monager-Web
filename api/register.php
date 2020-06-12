<?php
include "dbconnect.php";
session_start();

// get the path and body of the request
$input = json_decode(file_get_contents("php://input"), true);

//retrieve data
$fullname = $input['fullname'];
$email = $input['email'];
$password = $input['password'];
$confirmPass = $input['confirmPass'];
$accType = $input['accType'];

//echo ("<script>console.log('email: ". $email. "')</script>");

//sql
$sql = 'INSERT INTO `user`(fullname, email, password, accType)
        VALUES("'.$fullname.'", "'.$email.'", "'.$password.'", "'.$accType.'")';
$sql2 = 'SELECT * FROM user';

//check if email exists
$check = mysqli_query($conn, $sql2);
if($check){
    while($row = mysqli_fetch_array($check)){
        //echo ("<script>console.log('email: ". $row['email']. "')</script>");
        if ($email == $row['email']){
            echo "Email already exists";
        }else{
            if(mysqli_query($conn,$sql)){
                echo "Register Successful!";
            }
        }
    }
}





mysqli_close($conn);
?>