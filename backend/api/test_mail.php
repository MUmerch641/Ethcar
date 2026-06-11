<?php
// test_mail.php
// Visit this file in your browser: https://ehtacars.com/api/test_mail.php

$to = "wahab22official@gmail.com"; // Put your email here to test
$subject = "Test Email from Ehta";
$message = "If you can see this, PHP mail() is working on your server.";
$headers = "From: Contact@ehta.net";

if(mail($to, $subject, $message, $headers)) {
    echo "Test email sent successfully to $to. Please check your Inbox and SPAM folder.";
} else {
    echo "Email delivery failed. Your server might have disabled the mail() function.";
}
?>
