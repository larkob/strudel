globalThis.sound = new Function('name',`
   return s(name).out()
`);
Pattern.prototype.sound = function(name) {
   return this.s(name).out()
}

globalThis.flatcat = new Function('...pats',`
   return slowcat(...[].concat(pats.flat(Infinity)))
`);
Pattern.prototype.flatcat = function (...pats) {
   return this.slowcat(...[].concat(pats.flat(Infinity)))
}

globalThis.play = new Function('pat',`
   if (typeof globalScale !== 'undefined' && pat._firstCycleValues.every(x => isRelativeNumber(x))) {
    return pure("x").setOut(this.setOut(note(pat.scale(globalScale))))
  }
  if (pat._firstCycleValues.every(x => isNote(x))) {
    return pure("x").setOut(note(pat))
  }
  return pure("x").setOut(pat)
`)
Pattern.prototype.play = function (pat) {
  if (typeof globalScale !== 'undefined' && pat._firstCycleValues.every(x => isRelativeNumber(x))) {
    return this.setOut(this.setOut(note(pat.scale(globalScale))))
  }
  if (pat._firstCycleValues.every(x => isNote(x))) {
    return this.setOut(note(pat))
  }
  return this.setOut(pat)
}

Pattern.prototype.bpm = function (tempo) {
   return this.slow(240 / bpm)
}