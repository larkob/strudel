*****
I've started writing "A Musicians Guide to Strudel" as a way to help me and others learn Strudel. It's very different from the existing Tutorial because I'm trying to apply the perspective of musicians who are used to working with a groove box or DAW, playing in a band and reading musical notation. So, the focus is not on live coding (for now) but on writing songs with code. The emphasis is on structure and readability because I want to express how the song works, and ideally I would want my audience in a live coding session to be able to understand it (at least the ones with musical background). You can look at what I've got so far here: https://github.com/larkob/strudel/blob/main/tutorial/musicians_guide.mdx - I've created a `flatcat` helper function so I can concatenate without worrying about arrays (as flatcat uses flattenDeep before concatenating). So, in order to run some of my examples, you would have to use my fork. 

****

pattern 21-29


var pattern = {
  pt1: {
    bd: "x ~ x ~",
    sd: "~ x ~ x",
  },
  pt2: {
    bd: cat("x ~ x ~", "x ~ [x x] ~"),
    sd: cat("~ x ~ x", "~ x ~ x"),
  },
  pt3: {
    bd: cat("x ~ [x x] ~", "x [~ x] [~ x] ~"),
    sd: cat("~ x ~ x", "~ x ~ x"),
  },
}

stack(
  s("hh").struct("x!8"),
  s("sd").struct(pattern.pt1.sd),
  s("bd").struct(pattern.pt1.bd),
  )
.bpm(120).webdirt()

Instead of quarters, you can also represent the measure in 8ths or 16ths.

More beats per measure allow you to provide more rhythmic details, such as playing the clap twice per quarter.

<MiniRepl tune={
`stack(
  s("cp").struct("x x ~ ~ ~ ~ ~ ~"),
  s("bd").struct("x ~ ~ ~ x ~ ~ ~"),
  s("hh").struct("x ~ x ~ x ~ x ~")
  )
.bpm(120).webdirt()`
} />

Alternatively, you can stay in 4/4 and use a sub-pattern for the first beat of the bar.

A sub-pattern squeezes everything into a single beat of the parent pattern.

Enclose sub-patterns in square brackets. You can create deeply-nested sub-patterns if you want.

<MiniRepl tune={
`stack(
  s("cp").struct("[x x] ~@3"),
  s("bd").struct("[x ~]!2"),
  s("hh").struct("x!4")
  )
.bpm(120).webdirt()`
} />

Another way to define sub-patterns is by using shorthand notation:

Use `*` with a number to play a note, beat, rest or pattern multiple times in a single beat.

You can affect an entire pattern by enclosing it in square brackets.

<MiniRepl tune={
`stack(
  s("cp").struct("x*2 ~@3"),
  s("bd").struct("[x ~]!2"),
  s("hh").struct("x!4")
  )
.bpm(120).webdirt()`
} />

Another useful way to represent patterns is Euclidian notation.

Use round brackets with two numbers (x,y) to evenly distribute (as far as possible) x notes over y beats.

This is most useful for playing claves:

<MiniRepl tune={
`stack(
  s("cp").struct("x(3,8) ~@3"),
  s("bd").struct("[x ~]!2"),
  s("hh").struct("x!4")
  )
.bpm(120).webdirt()`
} />

For swing, you can make notes `late`
<MiniRepl tune={
`stack(
  s("cp").struct("x(3,8) ~@3"),
  s("bd").struct("[x ~]!2"),
  s("hh").struct("x!4")
  )
.bpm(120).webdirt()`
} />

## Alternating patterns

By enclosing patterns in angle brackets, you can alternate between patterns.

Angle brackets can be nested just like square brackets, and you can combine all of them in a pattern.

<MiniRepl tune={
`stack(
  s("cp").struct("<x(3,8) [x ~ x]> ~!3"),
  s("bd").struct("[x ~]!2"),
  s("hh").struct("x!4")
  )
.bpm(120).webdirt()`
} />

Pattern alternation works for samples as well, both for the sound and its varation:

<MiniRepl tune={
`stack(
  s("<cp hh>").struct("<x(3,8) [x ~ x]> ~!3"),
  s("bd").n("<0 3 6>").struct("[x ~]*2"),
  s("hh").struct("x*4")
  )
.bpm(120).webdirt()`
} />

Pattern segments can be bypassed using the `mask` function:

<MiniRepl tune={
`stack(
  s("<cp hh>").struct("<x(3,8) [x ~ x]> ~!3"),
  s("bd").n("<0 3 6>").struct("[x ~]*2"),
  s("hh").struct("x*4")
  )
.mask("x x x x")
.bpm(120).webdirt()`
} />

Note that the `mask` function is specific to the structure its applied to, so anything outside this structure is ignored.

<MiniRepl tune={
`stack(
  s("bd").struct("[x x] x x [x x x]").mask("x [x ~ x] ~ [~ x] ~ ~ ~ ~ x x x x"),
  s("hh").struct("x!4")
  )
.bpm(120).webdirt()`
} />

Use `/` with a number to play a note, beat, rest or pattern once every __ cycles.

<MiniRepl tune={
`stack(
  s("bd").struct("x/2"),
  s("hh").struct("x!4")
  )
.bpm(120).webdirt()`
} />

This is equivalent to 

<MiniRepl tune={
`stack(
  s("bd").struct("<[x ~ ~ ~] [~ ~ ~ ~]>"),
  s("bd").struct(cat("[x ~ ~ ~]"))
  s("hh").struct("x!4")
)
.bpm(120).webdirt()`
} />

Be careful not to accidentally combine structures with different amount of beats:

<MiniRepl tune={
`stack(
  s("bd").struct("x ~ ~ ~ ~ ~ x x x ~ ~ ~ x ~ x x"),
  s("hh").struct("x x x x")
)
.bpm(120).webdirt()`
} />

The bass drum here will be interpreted as sixteenth notes whereas the hi-hat is interpreted as quarter notes.

One way to extend a pattern to multiple cycles/measures is to apply angle and square brackets:

<MiniRepl tune={
`stack(
  s("bd").struct("<[x ~ ~ ~] [~ ~ x x] [x ~ ~ ~] [x ~ x x]>"),
  s("hh").struct("x!4")
)
.bpm(120).webdirt()`
} />

Another way to extend a pattern is to concatenate it with other patterns:

<MiniRepl tune={
`stack(
  s("bd").struct("x ~ ~ ~".cat("~ ~ x x", "x ~ ~ ~", "x ~ x x")),
  s("hh").struct("x!4")
)
.bpm(120).webdirt()`
} />

## Volume, Gain and Silence

The volume of each pattern can be individually adjusted with `gain`.
To change the overall volume, set the `gain` of the entire stack.
As with other functions, you can also apply a pattern to the function arguments.
To silence a pattern, apply the `hush` function. 

<MiniRepl tune={
`stack(
  s("cp").struct("x(3,4) ~@3").hush(),
  s("bd").struct("[x ~]!2").gain(1.2),
  s("hh").struct("x!4").gain("[1 0.8]*2")
  )
.gain(1.4)
.bpm(120).webdirt()`
} />

## Sample Control

To increase or decrease the playback speed (i.e. pitch) of a sample, use the `speed` function:

<MiniRepl tune={
`s("hh").n(1).speed(0.1).webdirt()`
} />

You can also apply a cutoff filter to a sample sound: 

<MiniRepl tune={
`s("hh").n(1).cutoff(500).webdirt()`
} />

To shorten a sample, use the `begin` or `end` function:

<MiniRepl tune={
`s("hh").n(1).end(0.05).webdirt()`
} />

<MiniRepl tune={
`s("hh").n(1).begin(0.35).webdirt()`
} />

You can `cut` samples or ensure that long samples don't overlap with `clip`

# PR148

## Other

jux
juxBy
off
reset
chop
inside
outside
when
fastcat
slowcat
rev
sequence
polyrhythm
polymeter
every
brak
timecat
invert
signal
apply
layer
early
ply
striate
chop
range
rangex
range2
linger
zoom
color
log
drawLine
inv/invert
palindrome
superimpose
stut
stutWith
echo
iter
iterBack
chunk
chunkBack
segment
late
legato
velocity
mul
euclidLegato
sine/perlin/rand.range
hcutoff
bandf
hresonance
resonance
cut
layer
note
clip
attack
decay
sustain
degradeBy
speak
cat
bypass
div
addSqueeze
room
setFlip
voicings
rootNotes