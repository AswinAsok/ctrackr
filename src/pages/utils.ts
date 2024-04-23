import { NavigateFunction } from "react-router-dom";

export function getFormattedDate() {
    const currentDate = new Date();
    const period = currentDate.getHours() >= 12 ? "P.M." : "A.M.";
    const formattedHours = currentDate.getHours() % 12 || 12; // Convert to 12-hour format
    const formattedMinutes =
        currentDate.getMinutes() < 10 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();

    let dayOfMonth = currentDate.getDate();
    let daySuffix;
    if (dayOfMonth >= 11 && dayOfMonth <= 13) {
        daySuffix = "th";
    } else {
        switch (dayOfMonth % 10) {
            case 1:
                daySuffix = "st";
                break;
            case 2:
                daySuffix = "nd";
                break;
            case 3:
                daySuffix = "rd";
                break;
            default:
                daySuffix = "th";
        }
    }

    const formattedDate = `${dayOfMonth}${daySuffix} ${currentDate.toLocaleString("default", {
        month: "long",
    })}, ${formattedHours}:${formattedMinutes} ${period}`;

    return formattedDate;
}

export function convertTimestamp(timestamp: string): string {
    // Parse the timestamp string into a Date object
    const date = new Date(timestamp);

    // Define an array of month names
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Get the day, month, hour, and minute components
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    let hour = date.getHours();
    const minute = date.getMinutes();

    // Determine AM or PM
    const ampm = hour >= 12 ? "P.M." : "A.M.";

    // Convert hour to 12-hour format
    hour = hour % 12;
    hour = hour ? hour : 12; // Handle midnight (0 hour)

    // Format the date string
    const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${hour}:${minute
        .toString()
        .padStart(2, "0")} ${ampm}`;

    return formattedDate;
}

// Helper function to get the ordinal suffix for a number (e.g., 1st, 2nd, 3rd)
function getOrdinalSuffix(number: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}

interface Coordinate {
    latitude: number;
    longitude: number;
}

export function calculateDistance(location1: Coordinate, location2: Coordinate): number {
    const earthRadius = 6371; // Earth's radius in kilometers

    // Convert latitude and longitude to radians
    const lat1Rad = toRadians(location1.latitude);
    const lon1Rad = toRadians(location1.longitude);
    const lat2Rad = toRadians(location2.latitude);
    const lon2Rad = toRadians(location2.longitude);

    // Calculate the differences between coordinates
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;

    // Apply the Haversine formula
    const a =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance in kilometers
    const distanceInKm = earthRadius * c;

    // Convert to meters if distance is less than 1 kilometer
    if (distanceInKm < 1) {
        return Math.round(distanceInKm * 1000);
    }

    return distanceInKm;
}

// Helper function to convert degrees to radians
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// console.log(`Distance between the two locations: ${distance} ${distance < 1000 ? "meters" : "km"}`);

export const checkAuth = async ({
    navigate,
    toast,
}: {
    navigate: NavigateFunction;
    toast: any;
}) => {
    const id = localStorage.getItem("userObject");

    if (!id) {
        toast.error("Please login to continue.");
        navigate("/");
    }
};
