export const toScaledHundred = (value) => Math.round(Number(value) * 100);

export const toScaledTen = (value) => Math.round(Number(value) * 10);

export const parseLapTimeToMs = (lapTime) => {
    const match = lapTime.trim().match(/^(\d+):(\d{2})\.(\d{3})$/);

    if(!match) {
        return NaN;
    }

    const minutes = Number(match[1]);
    const seconds = Number(match[2]);
    const milliseconds = Number(match[3]);

    return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
};

