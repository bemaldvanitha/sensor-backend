const convertToDate = (data) => {
    const dateTime = data.split(" ")
    const date = dateTime[0].split("-")
    const time = dateTime[1].split(":")
    const newDate = new Date(date[0], date[1] - 1 , date[2], time[0], time[1], time[2])
    return newDate
}

module.exports = convertToDate