<?php
// db_config.php
// Replace these with your actual cPanel MySQL credentials
$host = 'localhost';
$db_name = 'ehtacars_taxi_booking';
$username = 'ehtacars_ehtacars';
$password = 'Saranghae9?cars';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
