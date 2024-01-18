<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Connect to the database
$servername = "sql204.infinityfree.com";
$username = "if0_34991254";
$password = "FAsSPt67UX";
$dbname = "if0_34991254_mydb";

$conn = mysqli_connect($servername, $username, $password, $dbname);

$response = array();

if (!$conn) {
    $response["success"] = false;
    $response["message"] = "Connection failed: " . mysqli_connect_error();
} else {
    // Check if mobileNumber is set in the query parameters
    if (isset($_GET["mobileNumber"])) {
        $mobileNumber = $_GET["mobileNumber"];

        // Use prepared statement to prevent SQL injection
        $sql = "SELECT * FROM appointments WHERE patient_number = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $mobileNumber);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($result) {
            $appointments = array();

            while ($row = mysqli_fetch_assoc($result)) {
                $appointments[] = $row;
            }

            if (empty($appointments)) {
                $response["success"] = false;
                $response["message"] = "No appointments found for mobile number $mobileNumber";
            } else {
                $response["success"] = true;
                $response["message"] = "Appointments retrieved successfully";
                $response["appointments"] = $appointments;
            }
        } else {
            $response["success"] = false;
            $response["message"] = "Error occurred while fetching appointments: " . mysqli_error($conn);
        }
        
        mysqli_stmt_close($stmt);
    } else {
        $response["success"] = false;
        $response["message"] = "Mobile number not provided in the request";
    }

    mysqli_close($conn);
}

// Return the JSON response
echo json_encode($response);
?>
