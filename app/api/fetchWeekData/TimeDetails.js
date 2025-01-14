// const { exec } = require('child_process');

// // Command to execute the Python script
// const command = 'python3 TimeFetch.py';

// exec(command, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`Stderr: ${stderr}`);
//         return;
//     }

//     try {
//         // Parse the JSON output from the Python script
//         // const weekData = JSON.parse(stdout);
//         const weekData = stdout;
//         console.log('Week Data:', weekData);

//         // Use `weekData` as needed in your JS logic
//     } catch (err) {
//         console.error('Failed to parse Python script output:', err.message);
//     }
// });


const { exec } = require('child_process');

/**
 * Executes the Python script and returns the output as a Promise.
 * @returns {Promise<string>} - The stdout output of the Python script.
 */
export default function fetchWeekData() {
    return new Promise((resolve, reject) => {
        const command = 'python3 /home/harish_c/Desktop/hours/app/api/fetchWeekData/TimeFetch.py';

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Stderr: ${stderr}`);
                return;
            }

            try {
                // Resolve with the output of the script
                resolve(stdout.trim()); // Trim to remove extra newlines
            } catch (err) {
                reject(`Failed to parse output: ${err.message}`);
            }
        });
    });
}

// Example usage of the fetchWeekData function
// fetchWeekData()
//     .then((weekData) => {
//         console.log('Week Data:', weekData);
//         // Add your logic to handle weekData here
//     })
//     .catch((error) => {
//         console.error('Error fetching week data:', error);
//     });

