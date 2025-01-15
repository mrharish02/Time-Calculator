const { exec } = require('child_process');

/**
 * Executes the Python script and returns the output as a Promise.
 * @returns {Promise<string>} - The stdout output of the Python script.
 */
export default function crackPassword({staffNo}) {
    // console.log(staffNo,'in fetchweekdata',date)
    
    return new Promise((resolve, reject) => {
        const command = `python3 /home/harish_c/Desktop/hours/app/api/crackPassword/CrackPassword.py ${staffNo}`;

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

