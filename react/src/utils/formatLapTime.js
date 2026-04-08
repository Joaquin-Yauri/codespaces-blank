function formatLapTimeMs(totalMs) {
    const minutes = Math.floor(totalMs / 60000);
    const remainingMs = totalMs % 60000;
    const seconds = Math.floor(remainingMs / 1000);
    const milliseconds = remainingMs % 1000;

    const displaySeconds = String(seconds).padStart( 2, '0');
    const displayMs = String(milliseconds).padStart( 3, '0');

    return `${minutes}:${displaySeconds}.${displayMs}`;
}

export { formatLapTimeMs };