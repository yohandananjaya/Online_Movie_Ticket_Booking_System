const timeFormat = (minute) => {
    const hours = Math.floor(minute / 60);
    const minutesRemainder = minute % 60;
    return `${hours}h ${minutesRemainder}m`;
    }

    export default timeFormat;