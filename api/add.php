<?php
include "dbconnect.php";
session_start();

// get the path and body of the request
$input = json_decode(file_get_contents("php://input"), true);

//get the action type
$type = $_GET['type'];
$balance = $_GET['balance'];

//retrieve data
$email = $_SESSION['loggedUserID'];
$name = $input['name'];
$amount = $input['amount'];
$category = $input['category'];
$date = $input['date'];
$date = date("Y-m-d", strtotime($input['date']));

$deductBalance = $balance - $amount;
$addBalance = $balance + $amount;

//echo ("<script>console.log('balance: ". $balance. "')</script>");
//echo ("<script>console.log('deductBalance: ". $deductBalance. "')</script>");
//echo ("<script>console.log('name: ". $name. "')</script>");

//sql
$sql2 = "SELECT * FROM category WHERE catName = '$category'";
$sql3 = 'INSERT INTO `category`(catName) VALUES("'.$category.'")';

function addExpense($connection, $expSql){
    $result = mysqli_query($connection,$expSql);
    //$result2 = mysqli_query($connection,$deductSql);
    if($result){
        echo "Expense Added";
    }else{
        echo "Adding Expense Failed";
    }  
}

function addIncome($connection, $incomeSql){
    $result = mysqli_query($connection,$incomeSql);
    //$result2 = mysqli_query($connection,$addSql);
    if($result){
        echo "Income Added";
    }else{
        echo $result;
    }  
}
//check the category ID
$check = mysqli_query($conn, $sql2);
if($check){
        $row = mysqli_fetch_array($check);
        //echo ("<script>console.log('categories: ". $categories. "')</script>");
        if(empty($row)){
            mysqli_query($conn,$sql3); 
            $check2 = mysqli_query($conn,$sql2);
            $row2 = mysqli_fetch_array($check2);
            
            $category = $row2['catID'];
            $sql = "INSERT INTO expenses(email, name, amount, category, date)
                    VALUES('$email', '$name', '$amount', '$category', '$date')";
            $incSql = "INSERT INTO income(email, name, amount, category, date)
                    VALUES('$email', '$name', '$amount', '$category', '$date')";
            //echo ("<script>console.log('categoryID: ". $category. "')</script>");
            if($type == "expense"){
                addExpense($conn, $sql);
            }
            if($type == "income"){
                addIncome($conn, $incSql); 
            }
        }else{
    
            $category = $row['catID'];
            $sql = "INSERT INTO expenses(email, name, amount, category, date)
                    VALUES('$email', '$name', '$amount', '$category', '$date')";
            $incSql = "INSERT INTO income(email, name, amount, category, date)
                    VALUES('$email', '$name', '$amount', '$category', '$date')";
            //echo ("<script>console.log('categoryID: ". $category. "')</script>");
            if($type == "expense"){
                addExpense($conn, $sql); 
            }
            
            if($type == "income"){
                addIncome($conn, $incSql);
            }
        }
        
    
}





mysqli_close($conn);
?>
