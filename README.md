# moment-date-range [![Build Status](https://travis-ci.org/SimonJang/moment-date-range.svg?branch=master)](https://travis-ci.org/SimonJang/moment-date-range)

> Creates an generator to lazily loop over a date range using [moment](https://www.npmjs.com/package/moment).

## Requirements

- Node >= 8
- [moment](https://www.npmjs.com/package/moment) (**Peer dependency**)

## Install

```bash
$ npm install --save moment-date-range
```

## Usage

### With only `start` passed

```js
import {range} from '@simonja/moment-date-range';

const generator = range(moment('2020-01-21'));

for (const day of generator) {
    console.log(day.format('YYYY-MM-DD')) // 2020-01-21 -> Infinity
}
```

### With `start` and `end` passed using the default configuration options passed

```js
import {range} from '@simonja/moment-date-range';

const generator = range(moment('2020-01-21'), moment('2020-01-31'));

for (const day of generator) {
    console.log(day.format('YYYY-MM-DD')) // 2020-01-21 -> 2020-01-31
}
```

### With a `start`, `end` and configuration options

```js
import {range} from '@simonja/moment-date-range';

const generator = range(moment('2020-01-01'), moment('2020-01-05'), {step: 2, unit: 'd'});

for (const day of generator) {
    console.log(day.format('YYYY-MM-DD')) // 2020-01-01 -> 2020-01-03 -> 2020-01-05
}
```

### Without lazy computation

```js
import {range} from '@simonja/moment-date-range';

const generator = range(moment('2020-01-01'), moment('2020-01-10'));

const dates = Array
    .from(generator)
    .map(item => item.format('YYYY-MM-DD'));

console.log(dates)

// ['2020-01-01',
// '2020-01-02',
// '2020-01-03',
// '2020-01-04',
// '2020-01-05',
// '2020-01-06',
// '2020-01-07',
// '2020-01-08',
// '2020-01-09',
// '2020-01-10']
```

### With `start` and `end` with a negative `step` configuration

```js
import {range} from '@simonja/moment-date-range';

const generator = range(moment('2020-01-31'), moment('2020-01-29'), {step: -1});

for (const day of generator) {
    console.log(day.format('YYYY-MM-DD')) // 2020-01-31 -> 2020-01-30 -> 2020-01-29
}
```

### With `start` and `end` with a defined `unit`

```js
import {range} from '@simonja/moment-date-range';

const generator = range(moment('2020-01-01'), moment('2020-01-18'), {unit: 'w'});

for (const day of generator) {
    console.log(day.format('YYYY-MM-DD')) // 2020-01-01 -> 2020-01-08 -> 2020-01-15
}
```

## API

### range(start, [end], [options]) -> Generator<Moment>

#### start

Type: `moment` object

Start of the date range

#### end

Type: `moment` object

End of the date range

#### options

Configuration options

##### options.step

Number of units between each iteration. Default `1`

##### options.unit

Unit used during iteration. Default `d`

#### Generator<Moment>

Result of the `range` function. Returns a generator that lazily creates `moment` objects.