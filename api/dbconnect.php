<?php
$conn = mysqli_connect('localhost', 'root', '', 'monager');

if(!$conn){
    die("Connection failed: ".mysqli_connect_error());
}
?>