// Car Makes
const CarMakes = [
  { id: 1, name: 'Audi' },
  { id: 2, name: 'Bmw' },
  { id: 3, name: 'Toyota' },
  { id: 4, name: 'Benz' },
]

// Pricing
const Pricing = [
  { id: 1, amount: 'Ksh 9,499,999' },
  { id: 2, amount: 'Ksh 10,499,999' },
  { id: 3, amount: 'Ksh 7,999,999' },
  { id: 4, amount: 'Ksh 11,499,999' },
]

// Brands
const Brands = [
  { id: 1, name: 'Toyota', logo: '/icons/toyota.png' },
  { id: 2, name: 'Bmw', logo: '/icons/iconsbmw.png' },
  { id: 3, name: 'Audi', logo: '/icons/audi.png' },
  { id: 4, name: 'Mercedes Benz', logo: '/icons/benz.png' },
  { id: 5, name: 'Isuzu', logo: '/icons/isuzu.png' },
  { id: 6, name: 'Volvo', logo: '/icons/volvo.png' },
  { id: 7, name: 'Volkswagen', logo: '/icons/vw.png' },
  { id: 8, name: 'Chevrolet', logo: '/icons/chevrolet.png' },
  { id: 9, name: 'Ford', logo: '/icons/ford.png' },
  { id: 10, name: 'Lincoln', logo: '/icons/lincoln.png' },
  { id: 11, name: 'Lexus', logo: '/icons/lexus.png' },
]

// Cars (USED FOR SEARCH)
const Cars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Land Cruiser',
    condition: 'New',
    price: 'Ksh 9,499,999',
  },
  {
    id: 2,
    make: 'Bmw',
    model: 'X5',
    condition: 'Foreign used',
    price: 'Ksh 10,499,999',
  },
  {
    id: 3,
    make: 'Audi',
    model: 'Q7',
    condition: 'New',
    price: 'Ksh 11,499,999',
  },
  {
    id: 4,
    make: 'Benz',
    model: 'GLE',
    condition: 'Foreign used',
    price: 'Ksh 7,999,999',
  },
  {
    id: 5,
    make: 'Toyota',
    model: 'Prado',
    condition: 'Foreign used',
    price: 'Ksh 7,999,999',
  },
  {
    id: 6,
    make: 'Bmw',
    model: 'X7',
    condition: 'New',
    price: 'Ksh 11,499,999',
  },
  {
    id: 7,
    make: 'Audi',
    model: 'A6',
    condition: 'New',
    price: 'Ksh 9,499,999',
  },
  {
    id: 8,
    make: 'Benz',
    model: 'S-Class',
    condition: 'New',
    price: 'Ksh 10,499,999',
  },
]

// SINGLE EXPORT (IMPORTANT)
export default {
  CarMakes,
  Pricing,
  Brands,
  Cars,
}
