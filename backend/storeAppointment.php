<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

$response = array();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if the request contains a JSON payload
    $input_data = file_get_contents("php://input");
    $data = json_decode($input_data);

    if ($data) {
        // Your database connection code
        $servername = "sql204.infinityfree.com";
        $username = "if0_34991254";
        $password = "FAsSPt67UX";
        $dbname = "if0_34991254_mydb";

        // Use PDO for database connection (provides better security)
        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Prepare the SQL statement to prevent SQL injection
            $stmt = $conn->prepare("INSERT INTO appointments (patient_name, patient_number, patient_gender, appointment_time, preferred_mode)
                                    VALUES (:patientName, :patientNumber, :patientGender, :appointmentTime, :preferredMode)");

            // Bind parameters
            $stmt->bindParam(':patientName', $data->patientName);
            $stmt->bindParam(':patientNumber', $data->patientNumber);
            $stmt->bindParam(':patientGender', $data->patientGender);
            $stmt->bindParam(':appointmentTime', $data->appointmentTime);
            $stmt->bindParam(':preferredMode', $data->preferredMode);

            // Execute the statement
            $stmt->execute();

            $response["success"] = true;
            $response["message"] = "Appointment Scheduled!";
        } catch (PDOException $e) {
            $response["success"] = false;
            $response["message"] = "Error occurred while scheduling appointment: " . $e->getMessage();
        } finally {
            // Close the database connection
            $conn = null;
        }
    } else {
        $response["success"] = false;
        $response["message"] = "Invalid JSON data!";
    }
} else {
    $response["success"] = false;
    $response["message"] = "Invalid request method!";
}

// Return the JSON response
echo json_encode($response);
?>