import { MiniRepl } from './MiniRepl';

# A Musicians Guide to Strudel

Strudel is like a programmable groove box with
* unlimited amount of tracks
* built-in sample player
* multiphonic synth engine
* polymeter and -rhythm support
* sound effects
* Web MIDI support
* optional visualization of beats (code highlighting) and notes (piano roll)
* vast amount of control and extensibility via JavaScript

In this guide, you'll learn about

Part I: Beats & Percussive Samples

Part II: Melodies & Harmonies

Part III: Sound Generation

Part IV: Song Structure

## Introduction to Part I

Most groove boxes work with a grid interface (typically with one row per track and 8 or 16 columns for beats).

Strudel can work like that as well, but you'll quickly learn how to move beyond a rigid grid.

Here's a simple example of making beats with Strudel that should feel quite familiar:

<MiniRepl tune={
`samples({
  bass_drum: 'clubkick/2.wav',
  snare: ['808sd/SD0010.WAV','808sd/SD0050.WAV'],
  hihat: 'hh/000_hh3closedhh.wav'
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/')

stack(
  sound("hihat")    .struct("x x x x x x x x x x x x x x x x"),
  sound("snare:1")  .struct("~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~"),
  sound("bass_drum").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~"),
).bpm(30).out()`
} />

Press Play (`Ctrl+Enter`) to start or Pause (`Ctrl+.`) to stop playing.

Note that re-starting will not start the patterns at the beginning, but continue at whatever point the internal cycle pointer currently is.

## Essentials

Let's start with the bare essentials for making beats.

The following example plays a hi-hat beat (named "hh") in a loop. 

<MiniRepl tune={
`sound("hh").webdirt()`
} />

The `sound` function specifies the sound you want to play. The dot chains functions together.

Here, the result of the `sound` function is passed to the `webdirt` sample player.

The Webdirt sample player in Strudel comes pre-loaded with the following sounds:
* bd (bass drum, 14 variations)
* cb (cow bell)
* cp (clap)
* cr (crash)
* hh (closed hi-hat, 2 variations)
* ht (high tom, 6 variations)
* lt (low tom, 6 variations)
* misc (miscellaneous sounds, 6 variations)
* mt (mid tom, 5 variations)
* oh (open hi-hat)
* perc (percussive sound)
* rd (ride)
* rim (rim shot, 2 variations)
* sd (snare drum, 21 variations)

You select the sound variation number with `n` (remember that the index starts at 0):

<MiniRepl tune={
`sound("hh").n(1).webdirt()`
} />

You can also load your own sound samples using the `samples` function:

<MiniRepl tune={
`samples({
  bass_drum: 'clubkick/2.wav',
  snare: ['808sd/SD0010.WAV','808sd/SD0050.WAV'],
  hh: 'hh/000_hh3closedhh.wav',
  clak: 'clak/000_clak1.wav',
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');

sound("snare:1").out()`
} />

Note that when using `out` instead of `webdirt`, you can use ":" with a number as a shorthand for the `n` function.

## Parallel Tracks

To play multiple sounds in parallel, you stack them together using "," or the `stack` function:

<MiniRepl tune={
`sound("bd, cp").webdirt()`
} />

Which is equivalent to:

<MiniRepl tune={
`stack(
  sound("bd"),
  sound("cp")
  )
.webdirt()`
} />

## Cycles, Patterns and Tempo
By default, the tempo in Strudel is 60 CPM (cycles per minute), which corresponds to 240 BPM for a typical song in 4/4 time signature.

It's recommended to set the tempo in BPM for better familiarity. A typical range for BPM is between 80 and 160, with 120 often being the default tempo in groove boxes.

<MiniRepl tune={
`sound("hh").bpm(120).webdirt()`
} />

You'll notice that you hear the hi-hat once every 2 seconds because the BPM tempo assumes 4 beats per bar, but right now the bar (or cycle) contains only a single element.

Let's create a cycle with four elements now, using the `struct` function to set beats and rests. 
A rest uses the "~" symbol (or a 0), whereas anything else is considered a beat (we'll use "x" by convention).

<MiniRepl tune={
`sound("hh").struct("x ~ x ~").bpm(120).webdirt()`
} />

Most contemporary music is written in 4/4 time signature, where each bar holds four quarter notes, beats or rests. 
You can think of cycles as bars with a flexible amount of elements. 
With 4 elements, each element matches a quarter note. With 8 elements, each element matches an eight note, and so on.
You can have irregular lengths such as 3 or 7 and each cycle can have a different length.  
For example, one bar/cycle can have a four notes, the next a note and a rest, and the third contains one note.

<MiniRepl tune={
`sound("hh").struct("x x x x","x ~","x").webdirt()`
} />

Imagine that the entirety of bars is enclosed in repeat signs, so the music is continually repeating.
  
Why every second? Because the default tempo is 60 BPM and the only thing that's triggered in the looping cycle is the "hh" sound. 
By default, the tempo is 60 CPM (cycles per minute).

With a single beat per cycle, this is more or less equivalent to 60 BPM (beats per minute), i.e. one beat per second.

Let's add some rests and additional beats:

<MiniRepl tune={
`stack(
  sound("~ hh ~ hh"),
  sound("bd"),
  sound("~ cp")
  )
.webdirt()`
} />


You can change the absolute tempo using `cpm` and the relative tempo using `slow` or `fast` (where 1 means no change).

<MiniRepl tune={
`stack(
  sound("cp").slow(4),
  sound("bd").slow(1),
  sound("hh").fast(2)
  )
.cpm(120).webdirt()`
} />

With an overall tempo of 120 BPM (or CPM), the bass drum is played very slowly, effectively every quarter note (in a standard 4/4 measure).

The clap plays a single note per measure, whereas the hi-hat is played in eights.

Another way to represent the same rhythmic pattern is to use rests in each individual pattern and slow down the overall tempo so that each beat represents a quarter note.

<MiniRepl tune={
`stack(
  sound("cb ~ ~ ~"),
  sound("bd ~ bd ~"),
  sound("hh hh hh hh")
  )
.slow(4).cpm(120).webdirt()`
} />

Instead of repeating the sample name, you can represent the structure of beats and rests using `struct`.

<MiniRepl tune={
`stack(
  sound("cp").struct("x ~ ~ ~"),
  sound("bd").struct("x ~ x ~"),
  sound("hh").struct("x x x x")
  )
.slow(4).cpm(120).webdirt()`
} />

Strudel also offers a convenient shorthand notation:

Use `!` with a number to repeat a note, beat, rest or pattern multiple times.

Use `@` with a number to sustain a note, beat, rest or pattern over multiple beats.

You can multiply a pattern by enclosing it in square brackets.

<MiniRepl tune={
`stack(
  sound("cp").struct("x ~@3"),
  sound("bd").struct("[x ~]!2"),
  sound("hh").struct("x!4")
  )
.slow(4).cpm(120).webdirt()`
} />

Instead of quarters, you can also represent the measure in eigths (8/8).

More beats per measure allow you to provide more rhythmic details, such as playing the clap twice per quarter.

<MiniRepl tune={
`stack(
  sound("cp").struct("x x ~ ~ ~ ~ ~ ~"),
  sound("bd").struct("x ~ ~ ~ x ~ ~ ~"),
  sound("hh").struct("x ~ x ~ x ~ x ~")
  )
.slow(4).cpm(120).webdirt()`
} />

Alternatively, you can stay in 4/4 and use a sub-pattern for the first beat of the bar.

A sub-pattern squeezes everything into a single beat of the parent pattern.

Enclose sub-patterns in square brackets. You can create deeply-nested sub-patterns if you want.

<MiniRepl tune={
`stack(
  sound("cp").struct("[x x] ~@3"),
  sound("bd").struct("[x ~]!2"),
  sound("hh").struct("x!4")
  )
.slow(4).cpm(120).webdirt()`
} />

Another way to define sub-patterns is by using shorthand notation:

Use `*` with a number to play a note, beat, rest or pattern multiple times in a single beat.

You can affect an entire pattern by enclosing it in square brackets.

<MiniRepl tune={
`stack(
  sound("cp").struct("x*2 ~@3"),
  sound("bd").struct("[x ~]!2"),
  sound("hh").struct("x!4")
  )
.slow(4).cpm(120).webdirt()`
} />

Another useful way to represent patterns is Euclidian notation.

Use round brackets with two numbers (x,y) to evenly distribute (as far as possible) x notes over y beats.

This is most useful for playing claves:

<MiniRepl tune={
`stack(
  sound("cp").struct("x(3,8) ~@3"),
  sound("bd").struct("[x ~]!2"),
  sound("hh").struct("x!4")
  )
.slow(4).cpm(120).webdirt()`
} />

For swing, you can make notes `late`
<MiniRepl tune={
`stack(
  sound("cp").struct("x(3,8) ~@3"),
  sound("bd").struct("[x ~]!2"),
  sound("hh").struct("x!4")
  )
.slow(4).cpm(120).webdirt()`
} />

## Alternating patterns

By enclosing patterns in angle brackets, you can alternate between patterns.

Angle brackets can be nested just like square brackets, and you can combine all of them in a pattern.

<MiniRepl tune={
`stack(
  sound("cp").struct("<x(3,8) [x ~ x]> ~!3"),
  sound("bd").struct("[x ~]!2"),
  sound("hh").struct("x!4")
  )
.slow(4).cpm(120).webdirt()`
} />

Pattern alternation works for samples as well, both for the sound and its varation:

<MiniRepl tune={
`stack(
  sound("<cp hh>").struct("<x(3,8) [x ~ x]> ~!3"),
  sound("bd").n("<0 3 6>").struct("[x ~]*2"),
  sound("hh").struct("x*4")
  )
.slow(4).cpm(120).webdirt()`
} />

Pattern segments can be bypassed using the `mask` function:

<MiniRepl tune={
`stack(
  sound("<cp hh>").struct("<x(3,8) [x ~ x]> ~!3"),
  sound("bd").n("<0 3 6>").struct("[x ~]*2"),
  sound("hh").struct("x*4")
  )
.mask("x x x x")
.slow(4).cpm(120).webdirt()`
} />

Note that the `mask` function is specific to the structure its applied to, so anything outside this structure is ignored.

<MiniRepl tune={
`stack(
  sound("bd").struct("[x x] x x [x x x]").mask("x [x ~ x] ~ [~ x] ~ ~ ~ ~ x x x x"),
  sound("hh").struct("x!4")
  )
.slow(4).cpm(120).webdirt()`
} />

Use `/` with a number to play a note, beat, rest or pattern once every __ cycles.

<MiniRepl tune={
`stack(
  sound("bd").struct("x/2"),
  sound("hh").struct("x!4")
  )
.slow(4).cpm(120).webdirt()`
} />

This is equivalent to 

<MiniRepl tune={
`stack(
  sound("bd").struct("<[x ~ ~ ~] [~ ~ ~ ~]>"),
  sound("bd").struct(cat("[x ~ ~ ~]"))
  sound("hh").struct("x!4")
)
.slow(4).cpm(120).webdirt()`
} />

Be careful not to accidentally combine structures with different amount of beats:

<MiniRepl tune={
`stack(
  sound("bd").struct("x ~ ~ ~ ~ ~ x x x ~ ~ ~ x ~ x x"),
  sound("hh").struct("x x x x")
)
.slow(4).cpm(120).webdirt()`
} />

The bass drum here will be interpreted as sixteenth notes whereas the hi-hat is interpreted as quarter notes.

One way to extend a pattern to multiple cycles/measures is to apply angle and square brackets:

<MiniRepl tune={
`stack(
  sound("bd").struct("<[x ~ ~ ~] [~ ~ x x] [x ~ ~ ~] [x ~ x x]>"),
  sound("hh").struct("x!4")
)
.slow(4).cpm(120).webdirt()`
} />

Another way to extend a pattern is to concatenate it with other patterns:

<MiniRepl tune={
`stack(
  sound("bd").struct("x ~ ~ ~".cat("~ ~ x x","x ~ ~ ~","x ~ x x")),
  sound("hh").struct("x!4")
)
.slow(4).cpm(120).webdirt()`
} />

## Volume, Gain and Silence

The volume of each pattern can be individually adjusted with `gain`.
To change the overall volume, set the `gain` of the entire stack.
As with other functions, you can also apply a pattern to the function arguments.
To silence a pattern, apply the `hush` function. 

<MiniRepl tune={
`stack(
  sound("cp").struct("x(3,4) ~@3").hush(),
  sound("bd").struct("[x ~]!2").gain(1.2),
  sound("hh").struct("x!4").gain("[1 0.8]*2")
  )
.gain(1.4)
.slow(4).cpm(120).webdirt()`
} />

## Sample Control

To increase or decrease the playback speed (i.e. pitch) of a sample, use the `speed` function:

<MiniRepl tune={
`sound("hh").n(1).speed(0.1).webdirt()`
} />

You can also apply a cutoff filter to a sample sound: 

<MiniRepl tune={
`sound("hh").n(1).cutoff(500).webdirt()`
} />

To shorten a sample, use the `begin` or `end` function:

<MiniRepl tune={
`sound("hh").n(1).end(0.05).webdirt()`
} />

<MiniRepl tune={
`sound("hh").n(1).begin(0.35).webdirt()`
} />

You can `cut` samples or ensure that long samples don't overlap with `choke` or `clip`

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