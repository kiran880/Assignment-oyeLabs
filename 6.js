const numbers = [1, 2, 3, 4, 5 /* ... */, , 99, 100] // Array with one number missing

function findMissingNumber(numbers) {
  const n = 100 // Highest number in the range
  const expectedSum = (n * (n + 1)) / 2
  let actualSum = 0

  for (let i = 0; i < numbers.length; i++) {
    actualSum += numbers[i]
  }

  const missingNumber = expectedSum - actualSum
  return missingNumber
}

const missingNumber = findMissingNumber(numbers)
console.log('Missing Number:', missingNumber)
