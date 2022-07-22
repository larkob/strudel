globalThis.isRelativeNumberOrRest = new Function('num',`
   return /^[-]*[0-9]+|-$/.test(num)
`);

globalThis.global = new Function('object',`
   globalThis.global = object
`);

globalThis.inspect = new Function('pat',`
   console.log(pat.firstCycle(true).map(h=>h.showWhole()))
`);
Pattern.prototype.inspect = function() {
   console.log(this.firstCycle(true).map(h=>h.showWhole()))
   return this
}
//Pattern.prototype.define('inspect', (pat) => pat.inspect(), { composable: true, patternified: true });

globalThis.sound = new Function('name',`
   return s(name).out()
`);
Pattern.prototype.sound = function(name) {
   return this.s(name).out()
}
//Pattern.prototype.define('sound', (name, pat) => pat.sound(name), { composable: true, patternified: true });

globalThis.flatcat = new Function('...pats',`
   return slowcat(...[].concat(pats.flat(Infinity)))
`);
Pattern.prototype.flatcat = function (...pats) {
   return this.slowcat(...[].concat(pats.flat(Infinity)))
}
//Pattern.prototype.define('flatcat', (p, pat) => pat.flatcat(p), { composable: true, patternified: true });

globalThis.play = new Function('pat',`
   pat = flatcat(pat)
   if (typeof global.scale !== 'undefined' && pat._firstCycleValues.every(x => isRelativeNumberOrRest(x))) {
      return pure(true).setOut(note(pat.scale(global.scale)))
   }
   if (pat._firstCycleValues.every(x => isNote(x))) {
      return pure(true).setOut(note(pat))
   }
   return pure(true).setOut(pat)
`)
Pattern.prototype.play = function (pat) {
  pat = flatcat(pat)
  if (typeof global.scale !== 'undefined' && pat._firstCycleValues.every(x => isRelativeNumberOrRest(x))) {
    return this.setOut(note(pat.scale(global.scale)))
  }
  if (pat._firstCycleValues.every(x => isNote(x))) {
    return this.setOut(note(pat))
  }
  if (pat._firstCycleValues.every(x => x >= 0 && x <=127)) {
    return this.setOut(n(pat).note())
  }
   return this.setOut(pat)
}
//Pattern.prototype.define('play', (p, pat) => pat.play(p), { composable: true, patternified: true });

Pattern.prototype.bpm = function (tempo) {
   return this.slow(240 / tempo)
}
//Pattern.prototype.define('bpm', (tempo, pat) => pat.bpm(tempo), { composable: true, patternified: true });