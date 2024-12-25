function generateUserId() {
    // Generate a random number between 10000 and 99999
    const userId = Math.floor(10000 + Math.random() * 90000);
    return userId.toString(); // Convert to string if needed
}

module.exports = generateUserId; 