/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    await prisma.coffee.createMany({
        data: [
            { name: "Kopi Nusantara", price: 50_000, isForCoffeeEnthusiast: true, type: "Arabica", taste: "Light", isItForSweet: false, flavor: "Asam" },
            { name: "Kopi Mantap", price: 40_000, isForCoffeeEnthusiast: true, type: "Robusta", taste: "Strong", isItForSweet: true, flavor: "Pahit" },
            { name: "Kopi Santai", price: 35_000, isForCoffeeEnthusiast: false, type: "Arabica", taste: "Medium", isItForSweet: true, flavor: "Karamel" },
            { name: "Kopi Pecinta", price: 55_000, isForCoffeeEnthusiast: true, type: "Arabica", taste: "Strong", isItForSweet: false, flavor: "Coklat" },
            { name: "Kopi Asik", price: 45_000, isForCoffeeEnthusiast: false, type: "Robusta", taste: "Medium", isItForSweet: false, flavor: "Kacang" },
            { name: "Kopi Tropis", price: 60_000, isForCoffeeEnthusiast: true, type: "Arabica", taste: "Light", isItForSweet: true, flavor: "Buah" },
            { name: "Kopi Pagi", price: 30_000, isForCoffeeEnthusiast: false, type: "Robusta", taste: "Light", isItForSweet: true, flavor: "Karamel" },
            { name: "Kopi Sederhana", price: 25_000, isForCoffeeEnthusiast: false, type: "Arabica", taste: "Medium", isItForSweet: false, flavor: "Asam" },
            { name: "Kopi Malam", price: 35_000, isForCoffeeEnthusiast: true, type: "Robusta", taste: "Strong", isItForSweet: true, flavor: "Coklat" },
            { name: "Kopi Hangat", price: 40_000, isForCoffeeEnthusiast: false, type: "Arabica", taste: "Light", isItForSweet: true, flavor: "Pahit" },
            { name: "Kopi Premium", price: 65_000, isForCoffeeEnthusiast: true, type: "Arabica", taste: "Strong", isItForSweet: false, flavor: "Kacang" },
            { name: "Kopi Rakyat", price: 20_000, isForCoffeeEnthusiast: false, type: "Robusta", taste: "Medium", isItForSweet: true, flavor: "Karamel" },
            { name: "Kopi Kenangan", price: 50_000, isForCoffeeEnthusiast: true, type: "Arabica", taste: "Light", isItForSweet: false, flavor: "Buah" },
            { name: "Kopi Modern", price: 45_000, isForCoffeeEnthusiast: true, type: "Robusta", taste: "Medium", isItForSweet: true, flavor: "Coklat" },
            { name: "Kopi Tradisional", price: 35_000, isForCoffeeEnthusiast: false, type: "Arabica", taste: "Strong", isItForSweet: false, flavor: "Pahit" },
            { name: "Kopi Eksklusif", price: 70_000, isForCoffeeEnthusiast: true, type: "Arabica", taste: "Medium", isItForSweet: false, flavor: "Kacang" },
            { name: "Kopi Inspirasi", price: 55_000, isForCoffeeEnthusiast: true, type: "Robusta", taste: "Light", isItForSweet: true, flavor: "Asam" },
            { name: "Kopi Sehari", price: 30_000, isForCoffeeEnthusiast: false, type: "Robusta", taste: "Medium", isItForSweet: true, flavor: "Buah" },
            { name: "Kopi Klasik", price: 50_000, isForCoffeeEnthusiast: true, type: "Arabica", taste: "Strong", isItForSweet: false, flavor: "Coklat" },
            { name: "Kopi Kasual", price: 40_000, isForCoffeeEnthusiast: false, type: "Robusta", taste: "Light", isItForSweet: true, flavor: "Karamel" },
        ],
    });
    console.log("20 coffee records created!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


