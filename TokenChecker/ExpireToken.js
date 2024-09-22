// Function to extract and display the expiration time of the JWT
const jwt = require("jsonwebtoken")

function getJwtExpirationTime(token) {
    try {

        // Decode the token without verifying to get the payload
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {

            const currentTime = Math.floor(Date.now() / 1000);
            const timeLeft = decoded.exp - currentTime
            if (timeLeft > 0) {
                console.log(`Time Left: ${Math.floor(timeLeft / 60)} minutes ${timeLeft} seconds`)
                return timeLeft;
            }
            else {
                console.log("Expired")
            }


        }
    } catch (error) {
        console.error('Invalid token');
        return null;
    }
}


module.exports = { getJwtExpirationTime }