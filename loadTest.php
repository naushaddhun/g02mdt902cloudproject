<?php

// Start time of the script
$startTime = time();

// Function to calculate factorial
function factorial($n) {
    $result = 1;
    for ($i = 1; $i <= $n; $i++) {
        $result *= $i;
    }
    return $result;
}

// Function to perform a CPU-intensive task for 15 minutes
function performCpuIntensiveTask() {
    $sum = 0;
    while (true) {
        for ($i = 1; $i <= 100000000; $i++) {
            $sum += factorial($i);
        }

        // Check if 15 minutes have elapsed
        if ((time() - $GLOBALS['startTime']) >= 15 * 60) {
            break;
        }
    }
    return $sum;
}

// Execute the task
$result = performCpuIntensiveTask();

// Return a response
echo json_encode([
    'success' => true,
    'message' => 'CPU-intensive task (factorial calculations) completed after 15 minutes',
    'result' => $result,
]);

