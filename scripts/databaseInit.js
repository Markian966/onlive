require('dotenv').config();

const sequelize = require('../config/database');
const { Event, Sector, Reservation, ReservationSeat } = require('../models');

async function initDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    console.log('Step 1: Syncing database schema...');
    await sequelize.sync({ force: true });
    console.log('Database schema synced');

    console.log('Step 2: Creating events and sectors...');

    const sampleEvents = [
        {
            name: 'Taylor Swift - The Eras Tour',
            description: 'Experience the musical journey of a lifetime as Taylor Swift performs hits from every era of her incredible career. Don\'t miss this once-in-a-lifetime spectacle featuring songs from Fearless, 1989, Folklore, and more!',
            date: new Date('2026-07-15'),
            time: '19:30:00',
            venue: 'MetLife Stadium, East Rutherford, NJ',
            price: 125,
            imageUrl: '/images/taylor-swift-eras.jpeg',
            sectors: [
                { name: 'A', rows: 5, seatsPerRow: 30 },
                { name: 'B', rows: 5, seatsPerRow: 25 },
                { name: 'C', rows: 4, seatsPerRow: 20 },
                { name: 'D', rows: 3, seatsPerRow: 15 }
            ]
        },
        {
            name: 'Kevin Hart - Reality Check Tour',
            description: 'America\'s favorite comedian Kevin Hart brings his hilarious new stand-up special to life. Get ready for an evening of non-stop laughter with fresh material and his signature storytelling style!',
            date: new Date('2026-06-20'),
            time: '20:00:00',
            venue: 'Madison Square Garden, New York, NY',
            price: 85,
            imageUrl: '/images/kevin-hart-standup.jpeg',
            sectors: [
                { name: 'A', rows: 4, seatsPerRow: 25 },
                { name: 'B', rows: 4, seatsPerRow: 25 },
                { name: 'C', rows: 3, seatsPerRow: 20 }
            ]
        },
        {
            name: 'Imagine Dragons - Mercury World Tour',
            description: 'Join Imagine Dragons for an electrifying night of their biggest hits including "Radioactive," "Believer," and songs from their latest album Mercury. Experience their powerful live performance and stunning visual effects.',
            date: new Date('2026-08-10'),
            time: '19:00:00',
            venue: 'Crypto.com Arena, Los Angeles, CA',
            price: 95,
            imageUrl: '/images/imagine-dragons.jpeg',
            sectors: [
                { name: 'A', rows: 5, seatsPerRow: 40 },
                { name: 'B', rows: 5, seatsPerRow: 35 },
                { name: 'C', rows: 5, seatsPerRow: 30 },
                { name: 'D', rows: 4, seatsPerRow: 25 }
            ]
        },
        {
            name: 'Hamilton - Broadway Musical',
            description: 'The revolutionary musical phenomenon Hamilton comes to life with the original Broadway cast. Experience the story of America\'s founding father like never before with this Tony Award-winning masterpiece.',
            date: new Date('2026-06-05'),
            time: '19:30:00',
            venue: 'Richard Rodgers Theatre, New York, NY',
            price: 150,
            imageUrl: '/images/hamilton-broadway.jpeg',
            sectors: [
                { name: 'A', rows: 3, seatsPerRow: 20 },
                { name: 'B', rows: 4, seatsPerRow: 22 },
                { name: 'C', rows: 4, seatsPerRow: 18 }
            ]
        },
        {
            name: 'The Lion King - Broadway',
            description: 'Disney\'s award-winning musical brings the beloved story to life with stunning costumes, incredible music, and breathtaking performances. A visual feast for the whole family!',
            date: new Date('2026-06-12'),
            time: '19:00:00',
            venue: 'Minskoff Theatre, New York, NY',
            price: 120,
            imageUrl: '/images/lion-king-broadway.jpeg',
            sectors: [
                { name: 'A', rows: 3, seatsPerRow: 24 },
                { name: 'B', rows: 4, seatsPerRow: 26 },
                { name: 'C', rows: 4, seatsPerRow: 28 },
                { name: 'D', rows: 3, seatsPerRow: 22 }
            ]
        },
        {
            name: 'NBA Finals Game 7',
            description: 'Witness basketball history in the making! The ultimate showdown between the league\'s best teams in the decisive Game 7 of the NBA Finals. Don\'t miss this epic conclusion!',
            date: new Date('2026-06-18'),
            time: '20:00:00',
            venue: 'Chase Center, San Francisco, CA',
            price: 350,
            imageUrl: '/images/nba-finals.jpeg',
            sectors: [
                { name: 'A', rows: 4, seatsPerRow: 30 },
                { name: 'B', rows: 5, seatsPerRow: 35 },
                { name: 'C', rows: 5, seatsPerRow: 32 },
                { name: 'D', rows: 4, seatsPerRow: 28 }
            ]
        },
        {
            name: 'Billie Eilish - World Tour',
            description: 'The Grammy-winning sensation Billie Eilish brings her haunting melodies and powerful vocals to the stage in this intimate concert experience. Featuring songs from her latest album and all-time favorites.',
            date: new Date('2026-09-02'),
            time: '20:30:00',
            venue: 'United Center, Chicago, IL',
            price: 110,
            imageUrl: '/images/billie-eilish.jpeg',
            sectors: [
                { name: 'A', rows: 4, seatsPerRow: 32 },
                { name: 'B', rows: 5, seatsPerRow: 30 },
                { name: 'C', rows: 4, seatsPerRow: 28 }
            ]
        },
        {
            name: 'Coachella Valley Music Festival',
            description: 'The most iconic music festival in America returns with an incredible lineup of artists across multiple stages. Three days of music, art, and unforgettable experiences in the California desert!',
            date: new Date('2026-07-25'),
            time: '12:00:00',
            venue: 'Empire Polo Club, Indio, CA',
            price: 450,
            imageUrl: '/images/coachella-festival.jpeg',
            sectors: [
                { name: 'A', rows: 2, seatsPerRow: 50 },
                { name: 'B', rows: 3, seatsPerRow: 45 }
            ]
        }
    ];

    for (const eventData of sampleEvents) {
      const { sectors, ...eventFields } = eventData;

      const event = await Event.create(eventFields);
      console.log(`✓ Created event: ${event.name}`);

      for (const sectorData of sectors) {
        await Sector.create({
          eventId: event.id,
          name: sectorData.name,
          rows: sectorData.rows,
          seatsPerRow: sectorData.seatsPerRow
        });
      }

      console.log(`  ↳ Created ${sectors.length} sectors`);
    }

    console.log('\n✅ Database initialization completed successfully!');
    console.log(`Created ${sampleEvents.length} events with sectors`);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
    console.log('Disconnected from PostgreSQL');
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;