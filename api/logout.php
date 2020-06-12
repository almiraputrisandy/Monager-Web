<?php
//logout php function
   session_start();
   
   if(session_destroy()) {
      header("Location: ../index.html");
   }
?>