function simulate(startGender, X) {
    const names =
      startGender === 'F'
        ? ['G1','B1','G2','B2','G3','B3','G4','B4']
        : ['B1','G1','B2','G2','B3','G3','B4','G4'];
  
    let arr = names.slice();
    let idx = 0;
  
    const winners = [];
    for (let k = 0; k < 4; k++) {
      const elim = (idx + (X - 1)) % arr.length;
      winners.push(arr[elim]);
      arr.splice(elim, 1);
      idx = elim % arr.length;      
    }
    return winners;
  }
  
  function firstFourAreGirls(winners) {
    return winners.every(name => name.startsWith('G'));
  }
  
  function findXs(startGender, maxX = 1000, needed = 5) {
    const sols = [];
    for (let X = 5; X <= maxX; X++) {
      const winners = simulate(startGender, X);
      if (firstFourAreGirls(winners)) {
        sols.push({ X, winners });
        if (sols.length >= needed) break;
      }
    }
    return sols;
  }
  
  const femaleStartSolutions = findXs('F', 1000, 10);
  const maleStartSolutions   = findXs('M', 1000, 10);
  
  console.log('Start = Female, candidate X values:', femaleStartSolutions.map(s => s.X));
  console.log('Verify smallest X for Female start:');
  console.log(femaleStartSolutions[0]);
  
  console.log('\nStart = Male, candidate X values:', maleStartSolutions.map(s => s.X));
  