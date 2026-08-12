// Achievements parser — ported from parsers/achievements.py

function parseAchievements(data, output) {
    const rawAchievements = data.achievements || [];
    for (const ach of rawAchievements) {
        // Python: datetime.datetime(ach.year + OFFSET, month, day, 0, 0) then time.mktime()
        // mktime returns local-time epoch. JS Date constructor is also local time.
        const dateObj = new Date(
            ach.year + ACHIEVEMENT_YEAR_OFFSET,
            ach.month - 1,
            ach.day,
            0, 0, 0, 0
        );
        const timestamp = Math.floor(dateObj.getTime() / 1000);

        output.achievements += achievementTemplate.fill({
            achievement_id: ach.id,
            timestamp: timestamp
        });
    }
}
