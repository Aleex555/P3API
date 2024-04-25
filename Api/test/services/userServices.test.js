const { calculateAverageAge } = require('../../src/api/services/userServices');

describe('calculateAverageAge', () => {
  it('should calculate the correct average age', () => {
    const users = [
      { birthDate: '1990-01-01' },
      { birthDate: '1980-01-01' },
      { birthDate: '2000-01-01' }
    ];
    
    const result = calculateAverageAge(users);
    const currentYear = new Date().getFullYear();
    const expectedAverageAge = ((currentYear - 1990) + (currentYear - 1980) + (currentYear - 2000)) / 3;
    
    expect(result).toEqual(expectedAverageAge);
  });

  it('should return 0 if no users are provided', () => {
    const result = calculateAverageAge([]);
    expect(result).toEqual(0);
  });
});
