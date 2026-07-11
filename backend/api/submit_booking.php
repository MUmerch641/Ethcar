<?php
// submit_booking.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Invalid data"]);
        exit;
    }

    try {
        $trip_type = $data['tripType'] ?? 'one-way';
        $via_stop = !empty($data['viaStop']) ? $data['viaStop'] : null;
        $return_date = !empty($data['returnDate']) ? $data['returnDate'] : null;
        $return_time = !empty($data['returnTime']) ? $data['returnTime'] : null;
        $taxi_count = $data['taxiCount'] ?? 1;
        $estimated_price = $data['estimatedPrice'] ?? null;
        $distance = $data['distance'] ?? null;
        $booking_category = $data['bookingCategory'] ?? 'standard';
        $flight_number = !empty($data['flightNumber']) ? $data['flightNumber'] : null;
        $child_seats = isset($data['childSeats']) ? (int)$data['childSeats'] : 0;
        $wheelchair_accessible = !empty($data['wheelchairAccessible']) ? 1 : 0;
        $payment_method = $data['paymentMethod'] ?? 'cash';
        $company_name = !empty($data['companyName']) ? $data['companyName'] : null;
        $account_reference = !empty($data['accountReference']) ? $data['accountReference'] : null;

        // 1. Save to Database
        $stmt = $pdo->prepare("INSERT INTO bookings (pickup, dropoff, trip_type, via_stop, journey_date, journey_time, return_date, return_time, passengers, luggage, taxi_count, vehicle_id, estimated_price, distance, customer_name, customer_email, customer_phone, notes, booking_category, flight_number, child_seats, wheelchair_accessible, payment_method, company_name, account_reference) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $data['pickup'],
            $data['dropoff'],
            $trip_type,
            $via_stop,
            $data['date'],
            $data['time'],
            $return_date,
            $return_time,
            $data['passengers'],
            $data['luggage'],
            $taxi_count,
            $data['vehicleId'],
            $estimated_price,
            $distance,
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['notes'],
            $booking_category,
            $flight_number,
            $child_seats,
            $wheelchair_accessible,
            $payment_method,
            $company_name,
            $account_reference
        ]);

        // 2. Build Admin & Client Email Templates
        $admin_email = "Contactehta@gmail.com";
        $admin_subject = ($booking_category === 'airport' ? "✈️ [New Airport Booking Alert] " : "🚖 [New Booking Alert] ") . $data['pickup'] . " to " . $data['dropoff'];

        $admin_message = "
<html>
<head>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>New Booking Alert</title>
</head>
<body style='margin: 0; padding: 0; background-color: #0d2847; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;'>
    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #0d2847; padding: 20px 0;'>
        <tr>
            <td align='center'>
                <!-- Email Card Container -->
                <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);'>
                    
                    <!-- Header -->
                    <tr>
                        <td align='center' style='padding: 30px 40px; background-color: #0d2847; border-bottom: 2px solid #facc15;'>
                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                <tr>
                                    <td align='center'>
                                        <span style='font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;'>EHTA DISPATCH</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align='center' style='padding-top: 5px;'>
                                        <span style='font-size: 10px; font-weight: 700; color: #facc15; letter-spacing: 1px; text-transform: uppercase;'>New Booking Notification</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style='padding: 35px 35px 25px 35px;'>
                            
                            <!-- ROUTE SECTION -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td style='border-left: 3px solid #facc15; padding-left: 12px;'>
                                        <span style='font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;'>JOURNEY ROUTE</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding-top: 15px;'>
                                        <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 18px;'>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Route Type</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>🚘 " . strtoupper(str_replace('-', ' ', $trip_type)) . "</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Pickup Address</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📍 {$data['pickup']}</span>
                                                </td>
                                            </tr>
                                            " . ($via_stop ? "
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Via Intermediate Stop</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📌 {$via_stop}</span>
                                                </td>
                                            </tr>
                                            " : "") . "
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Drop-off Address</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>🏁 {$data['dropoff']}</span>
                                                </td>
                                            </tr>
                                            " . ($flight_number ? "
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Flight Number</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #facc15;'>✈️ {$flight_number}</span>
                                                </td>
                                            </tr>
                                            " : "") . "
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- DATE & TIME SECTION -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td style='border-left: 3px solid #facc15; padding-left: 12px;'>
                                        <span style='font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;'>SCHEDULE DETAILS</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding-top: 15px;'>
                                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                            <tr>
                                                <td width='50%' style='padding-right: 10px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 15px;'>
                                                        <tr>
                                                            <td>
                                                                <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Journey Date</span><br/>
                                                                <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📅 {$data['date']}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td width='50%' style='padding-left: 10px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 15px;'>
                                                        <tr>
                                                            <td>
                                                                <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Journey Time</span><br/>
                                                                <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>⏰ {$data['time']}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            " . (($return_date || $return_time) ? "
                                            <tr>
                                                <td colspan='2' style='padding-top: 15px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 15px;'>
                                                        <tr>
                                                            <td>
                                                                <span style='font-size: 10px; color: #fb7185; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Return Journey</span><br/>
                                                                <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📅 " . ($return_date ?: '—') . " at ⏰ " . ($return_time ?: '—') . "</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            " : "") . "
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CUSTOMER DETAILS -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td style='border-left: 3px solid #facc15; padding-left: 12px;'>
                                        <span style='font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;'>CUSTOMER PROFILE</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding-top: 15px;'>
                                        <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 18px;'>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Full Name</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>👤 {$data['name']}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Phone Number</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📞 <a href='tel:{$data['phone']}' style='color: #facc15; text-decoration: none;'>{$data['phone']}</a></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Email Address</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>✉️ <a href='mailto:{$data['email']}' style='color: #facc15; text-decoration: none;'>{$data['email']}</a></span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- SPECIFICATIONS & FARES -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td style='border-left: 3px solid #facc15; padding-left: 12px;'>
                                        <span style='font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;'>REQUIREMENTS & PRICE</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding-top: 15px;'>
                                        <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 18px;'>
                                            <tr>
                                                <td style='padding-bottom: 15px;'>
                                                    <!-- Badges Grid equivalent -->
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                        <tr>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>VEHICLE: " . strtoupper($data['vehicleId']) . "</div>
                                                            </td>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>CATEGORY: " . strtoupper($booking_category) . "</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>PASSENGERS: {$data['passengers']}</div>
                                                            </td>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>LUGGAGE: {$data['luggage']}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>VEHICLES: {$taxi_count}</div>
                                                            </td>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>PAYMENT: " . strtoupper($payment_method) . "</div>
                                                            </td>
                                                        </tr>
                                                        " . (($child_seats > 0 || $wheelchair_accessible) ? "
                                                        <tr>
                                                            " . ($child_seats > 0 ? "
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #fb7185;'>CHILD SEATS: {$child_seats}</div>
                                                            </td>
                                                            " : "") . "
                                                            " . ($wheelchair_accessible ? "
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.3); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #60a5fa;'>♿ WHEELCHAIR</div>
                                                            </td>
                                                            " : "") . "
                                                        </tr>
                                                        " : "") . "
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            " . ($company_name ? "
                                            <tr>
                                                <td style='padding-bottom: 12px; border-top: 1px solid #1e293b; padding-top: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Corporate Account</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>🏢 {$company_name}</span>
                                                </td>
                                            </tr>
                                            " : "") . "
                                            " . ($account_reference ? "
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Account Reference</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>🔢 {$account_reference}</span>
                                                </td>
                                            </tr>
                                            " : "") . "
                                            
                                            <tr>
                                                <td style='border-top: 1px solid #1e293b; padding-top: 15px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                        <tr>
                                                            " . ($estimated_price ? "
                                                            <td width='50%'>
                                                                <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Estimated Fare</span><br/>
                                                                <span style='font-size: 22px; font-weight: 800; color: #facc15;'>£{$estimated_price}</span>
                                                            </td>
                                                            " : "") . "
                                                            " . ($distance ? "
                                                            <td width='50%'>
                                                                <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Distance</span><br/>
                                                                <span style='font-size: 16px; font-weight: 600; color: #ffffff;'>{$distance}</span>
                                                            </td>
                                                            " : "") . "
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- SPECIAL NOTES -->
                            " . ($data['notes'] ? "
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td>
                                        <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Special Instructions</span>
                                        <div style='background-color: rgba(250, 204, 21, 0.04); border: 1px dashed rgba(250, 204, 21, 0.2); border-radius: 12px; padding: 15px; font-style: italic; color: #ffe066; font-size: 13px; margin-top: 5px; line-height: 1.5;'>
                                            \"{$data['notes']}\"
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            " : "") . "

                            <!-- ACTION BUTTON -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-top: 10px;'>
                                <tr>
                                    <td align='center'>
                                        <a href='https://ehtacars.com/admin' style='display: inline-block; background-color: #facc15; border-radius: 10px; color: #0d2847; font-size: 13px; font-weight: 800; letter-spacing: 1px; padding: 16px 36px; text-decoration: none; text-transform: uppercase; box-shadow: 0 4px 15px rgba(250, 204, 21, 0.3);'>Open Dispatch Desk</a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align='center' style='padding: 25px 40px; background-color: #0d2847; border-top: 1px solid #1e293b; font-size: 11px; color: #6b7280;'>
                            &copy; " . date('Y') . " Ehta Dispatch. Automated alert notification.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
";

        $client_message = "
<html>
<head>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Booking Confirmation</title>
</head>
<body style='margin: 0; padding: 0; background-color: #0d2847; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;'>
    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #0d2847; padding: 20px 0;'>
        <tr>
            <td align='center'>
                <!-- Email Card Container -->
                <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);'>
                    
                    <!-- Header -->
                    <tr>
                        <td align='center' style='padding: 30px 40px; background-color: #0d2847; border-bottom: 2px solid #facc15;'>
                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                <tr>
                                    <td align='center'>
                                        <span style='font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;'>EHTA</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align='center' style='padding-top: 5px;'>
                                        <span style='font-size: 10px; font-weight: 700; color: #facc15; letter-spacing: 1px; text-transform: uppercase;'>Booking Confirmation</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style='padding: 35px 35px 25px 35px;'>
                            
                            <!-- Welcome -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 25px;'>
                                <tr>
                                    <td style='font-size: 14px; color: #d1d5db; line-height: 1.6;'>
                                        Dear <strong>{$data['name']}</strong>,<br/><br/>
                                        Thank you for choosing Ehta. Your booking request has been securely registered in our system. A driver will be assigned and details will be sent prior to your journey. Below are your journey details:
                                    </td>
                                </tr>
                            </table>

                            <!-- ROUTE SECTION -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td style='border-left: 3px solid #facc15; padding-left: 12px;'>
                                        <span style='font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;'>YOUR ROUTE</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding-top: 15px;'>
                                        <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 18px;'>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Route Type</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>🚘 " . strtoupper(str_replace('-', ' ', $trip_type)) . "</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Pickup Address</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📍 {$data['pickup']}</span>
                                                </td>
                                            </tr>
                                            " . ($via_stop ? "
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Via Stop</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📌 {$via_stop}</span>
                                                </td>
                                            </tr>
                                            " : "") . "
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Drop-off Address</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>🏁 {$data['dropoff']}</span>
                                                </td>
                                            </tr>
                                            " . ($flight_number ? "
                                            <tr>
                                                <td>
                                                    <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Flight Number</span><br/>
                                                    <span style='font-size: 14px; font-weight: 600; color: #facc15;'>✈️ {$flight_number}</span>
                                                </td>
                                            </tr>
                                            " : "") . "
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- DATE & TIME SECTION -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td style='border-left: 3px solid #facc15; padding-left: 12px;'>
                                        <span style='font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;'>SCHEDULE</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding-top: 15px;'>
                                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                            <tr>
                                                <td width='50%' style='padding-right: 10px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 15px;'>
                                                        <tr>
                                                            <td>
                                                                <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Pickup Date</span><br/>
                                                                <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📅 {$data['date']}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td width='50%' style='padding-left: 10px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 15px;'>
                                                        <tr>
                                                            <td>
                                                                <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Pickup Time</span><br/>
                                                                <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>⏰ {$data['time']}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            " . (($return_date || $return_time) ? "
                                            <tr>
                                                <td colspan='2' style='padding-top: 15px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 15px;'>
                                                        <tr>
                                                            <td>
                                                                <span style='font-size: 10px; color: #fb7185; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Return Journey</span><br/>
                                                                <span style='font-size: 14px; font-weight: 600; color: #ffffff;'>📅 " . ($return_date ?: '—') . " at ⏰ " . ($return_time ?: '—') . "</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            " : "") . "
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- BOOKING PARAMETERS -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td style='border-left: 3px solid #facc15; padding-left: 12px;'>
                                        <span style='font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;'>BOOKING DETAILS</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding-top: 15px;'>
                                        <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 18px;'>
                                            <tr>
                                                <td style='padding-bottom: 15px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                        <tr>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>SERVICE: " . strtoupper($booking_category) . "</div>
                                                            </td>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>PASSENGERS: {$data['passengers']}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>LUGGAGE: {$data['luggage']}</div>
                                                            </td>
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: #1e293b; border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #facc15;'>PAYMENT: " . strtoupper($payment_method) . "</div>
                                                            </td>
                                                        </tr>
                                                        " . (($child_seats > 0 || $wheelchair_accessible) ? "
                                                        <tr>
                                                            " . ($child_seats > 0 ? "
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #fb7185;'>CHILD SEATS: {$child_seats}</div>
                                                            </td>
                                                            " : "") . "
                                                            " . ($wheelchair_accessible ? "
                                                            <td style='padding: 4px;' width='50%'>
                                                                <div style='background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.3); border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: bold; color: #60a5fa;'>♿ WHEELCHAIR</div>
                                                            </td>
                                                            " : "") . "
                                                        </tr>
                                                        " : "") . "
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <tr>
                                                <td style='border-top: 1px solid #1e293b; padding-top: 15px;'>
                                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                        <tr>
                                                            " . ($distance ? "
                                                            <td width='100%'>
                                                                <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Estimated Distance</span><br/>
                                                                <span style='font-size: 16px; font-weight: 600; color: #ffffff;'>{$distance}</span>
                                                            </td>
                                                            " : "") . "
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- NOTES TO DRIVER -->
                            " . ($data['notes'] ? "
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom: 30px;'>
                                <tr>
                                    <td>
                                        <span style='font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Your Notes to Driver</span>
                                        <div style='background-color: rgba(250, 204, 21, 0.04); border: 1px dashed rgba(250, 204, 21, 0.2); border-radius: 12px; padding: 15px; font-style: italic; color: #ffe066; font-size: 13px; margin-top: 5px; line-height: 1.5;'>
                                            \"{$data['notes']}\"
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            " : "") . "

                            <!-- SUPPORT NOTICE (NO DUMMY PHONE NUMBER) -->
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 20px;'>
                                <tr>
                                    <td style='font-size: 12px; color: #9ca3af; line-height: 1.6;'>
                                        Need to make changes or cancel your ride? Please contact our team via email at least 24 hours in advance at <a href='mailto:Contactehta@gmail.com' style='color: #facc15; font-weight: bold; text-decoration: none;'>Contactehta@gmail.com</a>.
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align='center' style='padding: 25px 40px; background-color: #0d2847; border-top: 1px solid #1e293b; font-size: 11px; color: #6b7280; line-height: 1.5;'>
                            Thank you for choosing Ehta.<br/>
                            &copy; " . date('Y') . " Ehta. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
";

        // Send Email to Admin
        $admin_headers = "MIME-Version: 1.0" . "\r\n";
        $admin_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $admin_headers .= "From: Ehta Dispatch <Contact@ehta.net>" . "\r\n";

        $admin_mail_sent = mail($admin_email, $admin_subject, $admin_message, $admin_headers);

        // Send Email to Client (Confirmation)
        $client_mail_sent = null;
        if (!empty($data['email'])) {
            $client_subject = "✉️ Ehta Booking Confirmation";
            $client_headers = "MIME-Version: 1.0" . "\r\n";
            $client_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $client_headers .= "From: Ehta Support <Contact@ehta.net>" . "\r\n";
            $client_headers .= "Reply-To: Contactehta@gmail.com" . "\r\n";
            
            $client_mail_sent = mail($data['email'], $client_subject, $client_message, $client_headers);
        }

        echo json_encode([
            "status" => "success",
            "message" => "Booking saved",
            "admin_mail_sent" => $admin_mail_sent,
            "client_mail_sent" => $client_mail_sent ?? null
        ]);

    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
