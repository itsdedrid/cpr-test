const MOVES = [
    [1, 0], 
    [0, 1],
    [2, 0],
    [0, 2],
    [1, 1], 
  ];
  
  function safe(M, C) {
    if (M < 0 || C < 0) return false;
    if (M > 0 && C > M) return false;
    return true;
  }
  
  function isStateSafe(Ml, Cl) {
    const Mr = 3 - Ml;
    const Cr = 3 - Cl;
    return safe(Ml, Cl) && safe(Mr, Cr);
  }
  
  function keyOf(Ml, Cl, boat) {
    return `${Ml},${Cl},${boat}`;
  }
  
  function solve() {
    const start = { Ml: 3, Cl: 3, boat: 'L' };
    const goalKey = keyOf(0, 0, 'R');
  
    const q = [];
    const visited = new Set();
    const parent = new Map();
  
    const startKey = keyOf(start.Ml, start.Cl, start.boat);
    q.push(start);
    visited.add(startKey);
    parent.set(startKey, null);
  
    while (q.length) {
      const cur = q.shift();
      const curKey = keyOf(cur.Ml, cur.Cl, cur.boat);
  
      if (curKey === goalKey) {
        // reconstruct path
        const path = [];
        let k = curKey;
        while (k !== null) {
          const p = parent.get(k);
          path.push({ stateKey: k, move: p ? p.move : null });
          k = p ? p.prevKey : null;
        }
        path.reverse();
        return path;
      }
  
      for (const [m, c] of MOVES) {
        let Ml2 = cur.Ml;
        let Cl2 = cur.Cl;
        let boat2 = cur.boat === 'L' ? 'R' : 'L';
  
        if (cur.boat === 'L') {
          Ml2 = cur.Ml - m;
          Cl2 = cur.Cl - c;
        } else {
          Ml2 = cur.Ml + m;
          Cl2 = cur.Cl + c;
        }
  
        if (Ml2 < 0 || Ml2 > 3 || Cl2 < 0 || Cl2 > 3) continue;
        if (!isStateSafe(Ml2, Cl2)) continue;
  
        const nextKey = keyOf(Ml2, Cl2, boat2);
        if (visited.has(nextKey)) continue;
  
        visited.add(nextKey);
        parent.set(nextKey, { prevKey: curKey, move: [m, c] });
        q.push({ Ml: Ml2, Cl: Cl2, boat: boat2 });
      }
    }
    return null;
  }
  
  function formatStep(i, prevKey, move, nextKey) {
    const [Ml1, Cl1, b1] = prevKey.split(',');
    const [Ml2, Cl2, b2] = nextKey.split(',');
  
    const Mr1 = 3 - Number(Ml1);
    const Cr1 = 3 - Number(Cl1);
    const Mr2 = 3 - Number(Ml2);
    const Cr2 = 3 - Number(Cl2);
  
    const [m, c] = move;
    const boatArrow = b1 === 'L' ? 'L → R' : 'R → L';
  
    const who =
      (m === 2 && c === 0) ? 'พระ 2' :
      (m === 0 && c === 2) ? 'คนป่า 2' :
      (m === 1 && c === 0) ? 'พระ 1' :
      (m === 0 && c === 1) ? 'คนป่า 1' :
      'พระ 1 + คนป่า 1';
  
    return [
      `เที่ยวที่ ${i}: (${who})  ${boatArrow}`,
      `    ก่อน: ซ้าย(M=${Ml1}, C=${Cl1}) | ขวา(M=${Mr1}, C=${Cr1})`,
      `    หลัง: ซ้าย(M=${Ml2}, C=${Cl2}) | ขวา(M=${Mr2}, C=${Cr2})`,
    ].join('\n');
  }
  
  const path = solve();
  if (!path) {
    console.log('ไม่พบวิธีที่ปลอดภัย');
  } else {
    console.log('ลำดับการข้ามที่สั้นที่สุด (ทุกขั้นปลอดภัย):\n');
  
    for (let i = 1; i < path.length; i++) {
      const prevKey = path[i - 1].stateKey;
      const { move } = path[i];
      const nextKey = path[i].stateKey;
      console.log(formatStep(i, prevKey, move, nextKey));
    }
  
    console.log(`\nรวมทั้งหมด ${path.length - 1} เที่ยว`);
  }
  