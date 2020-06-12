<?php
include "dbconnect.php";
session_start();

// get the path and body of the request
$input = json_decode(file_get_contents("php://input"), true);

//retrieve inputted email & password
$email = $input['email'];
$password = $input['password'];

//echo ("<script>console.log('email: ". $email. "')</script>");

//sql
$sql = "SELECT email, password, id FROM user WHERE email = '$email'";
$result = mysqli_query($conn,$sql);
//echo ("<script>console.log('sql: ". $sql. "')</script>");
if($result){
    $row = mysqli_fetch_array($result);

    if($row['email'] == $email && $row['password'] == $password){
        $_SESSION['loggedUser'] = $email;
        $_SESSION['loggedUserID'] = $row['id'];
        echo "Login Successful";
    }else if($email == "" && $password == ""){
        echo "Login Failed";
    }else{
        echo "Login Failed";
    }
}

mysqli_close($conn);
?>