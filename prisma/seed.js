const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Починаємо наповнення БД...');
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showing.deleteMany(); 
  await prisma.seat.deleteMany(); 
  await prisma.hall.deleteMany();

  console.log('🗑️  База очищена.');
  const hall = await prisma.hall.upsert({
    where: { name_hall: '1 Зала' },
    update: {},
    create: {
      name_hall: '1 Зала',
      type_hall: 'IMAX',
    },
  });
  console.log(`Зал створено: ${hall.name_hall}`);


  await prisma.seat.deleteMany({ where: { hall_id: hall.hall_id } });
  
  const seatsData = [];
  for (let row = 1; row <= 5; row++) {
    for (let num = 1; num <= 8; num++) {
      seatsData.push({
        hall_id: hall.hall_id,
        row_num: row,
        seat_number: num,
      });
    }
  }
  await prisma.seat.createMany({ data: seatsData });
  console.log(`Створено ${seatsData.length} місць.`);


  const genre = await prisma.genre.upsert({
    where: { genre_name: 'Sci-Fi' },
    update: {},
    create: { genre_name: 'Sci-Fi' },
  });

  const movie = await prisma.movie.create({
    data: {
      title: 'Interstellar',
      release_date: new Date('2014-11-07'),
      duration: 169,
      rating: 8.6,
      genres: {
        create: {
          genre: { connect: { genre_id: genre.genre_id } }
        }
      }
    },
  });
  console.log(`Фільм створено: ${movie.title}`);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);

  const showing = await prisma.showing.create({
    data: {
      movie_id: movie.movie_id,
      hall_id: hall.hall_id,
      start_time: tomorrow,
    },
  });

  console.log(`Сеанс створено! ID сеансу: ${showing.session_id}`);
  console.log('Наповнення завершено.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });