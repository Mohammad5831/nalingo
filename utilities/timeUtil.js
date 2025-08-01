const dayMap = {
    saturday: 6,
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
};

const generateSessions = (startDate, days, totalSessions) => {
    const sessions = [];
    let date = new Date(startDate);
    while (sessions.length < totalSessions) {
        if (days.includes(getDayName(date))) {
            sessions.push(new Date(date));
        } 
        date.setDate(date.getDate() + 1);
    }
    return sessions;
};

const getDayName = (date) => {
    const days = ['saturday', 'sunday', 'monday', 
        'tuesday', 'wednesday', 'thursday', 'friday',
    ];
    return days[date.getDay()]
};

module.exports = { generateSessions };